/**
 * firebase/auth.js
 * All auth helpers — email/password signup with OTP, Google OAuth,
 * rate-limiting, and Firestore user profile creation.
 *
 * Install: npm install firebase react-toastify
 */
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./config";

// ─── Constants ────────────────────────────────────────────────────────────────
const OTP_EXPIRY_MS   = 5 * 60 * 1000;   // 5 minutes
const MAX_OTP_ATTEMPTS = 5;               // lock after 5 wrong tries
const OTP_RATE_LIMIT_MS = 60 * 1000;     // must wait 60s before resend

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a cryptographically random 4-digit OTP */
export function generateOTP() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(arr[0] % 9000 + 1000); // always 4 digits: 1000–9999
}

/** Simple SHA-256 hash of a string */
export async function hashOTP(otp) {
  const encoded = new TextEncoder().encode(otp);
  const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Mask email for display: is*****@g***.com */
export function maskEmail(email) {
  const [local, domain] = email.split("@");
  const [domainName, tld] = domain.split(".");
  const maskedLocal = local.slice(0, 2) + "*".repeat(Math.max(3, local.length - 2));
  const maskedDomain = domainName.slice(0, 1) + "*".repeat(Math.max(2, domainName.length - 1));
  return `${maskedLocal}@${maskedDomain}.${tld}`;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateSignupForm({ firstName, lastName, email, phone, password, confirmPassword }) {
  const errors = {};

  if (!firstName.trim()) errors.firstName = "First name is required";
  else if (firstName.trim().length < 2) errors.firstName = "First name must be at least 2 characters";

  if (!lastName.trim()) errors.lastName = "Last name is required";
  else if (lastName.trim().length < 2) errors.lastName = "Last name must be at least 2 characters";

  if (!email.trim()) errors.email = "Email address is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address";

  if (!phone.trim()) errors.phone = "Phone number is required";
  else if (!/^(\+234|0)[789][01]\d{8}$/.test(phone.replace(/\s/g, "")))
    errors.phone = "Enter a valid Nigerian phone number";

  if (!password) errors.password = "Password is required";
  else {
    const checks = [
      { pass: password.length >= 8,    msg: "at least 8 characters" },
      { pass: /[A-Z]/.test(password),  msg: "an uppercase letter" },
      { pass: /[a-z]/.test(password),  msg: "a lowercase letter" },
      { pass: /[0-9]/.test(password),  msg: "a number" },
      { pass: /[^A-Za-z0-9]/.test(password), msg: "a special character" },
    ];
    const failed = checks.filter((c) => !c.pass).map((c) => c.msg);
    if (failed.length) errors.password = `Password must contain ${failed.join(", ")}`;
  }

  if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";

  return errors;
}

// ─── Step 1: Send OTP ─────────────────────────────────────────────────────────
/**
 * Sends a 4-digit OTP to the user's email via EmailJS.
 * Stores a hashed version in Firestore with expiry + attempt counter.
 * Uses a temporary pending-users collection — NOT the real users collection.
 */
export async function sendSignupOTP(email, formData) {
  // Check rate limiting: was an OTP already sent within the last 60s?
  const pendingRef = doc(db, "pendingSignups", email.toLowerCase());
  const existing   = await getDoc(pendingRef);

  if (existing.exists()) {
    const data = existing.data();
    const sentAgo = Date.now() - data.sentAt;
    if (sentAgo < OTP_RATE_LIMIT_MS) {
      const waitSec = Math.ceil((OTP_RATE_LIMIT_MS - sentAgo) / 1000);
      throw new Error(`Please wait ${waitSec}s before requesting another code.`);
    }
  }

  const otp    = generateOTP();
  const hashed = await hashOTP(otp);

  // Store hashed OTP + form snapshot in Firestore
  await setDoc(pendingRef, {
    hashedOTP:   hashed,
    sentAt:      Date.now(),
    expiresAt:   Date.now() + OTP_EXPIRY_MS,
    attempts:    0,
    firstName:   formData.firstName.trim(),
    lastName:    formData.lastName.trim(),
    phone:       formData.phone.trim(),
    displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
  });

  // Send OTP via EmailJS (configure with your EmailJS keys)
  // Replace VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
  // in your .env file and set up a template with {{otp}} and {{to_email}} variables
  const emailPayload = {
    service_id:  import.meta.env.VITE_EMAILJS_SERVICE_ID,
    template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    user_id:     import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email:  email,
      to_name:   formData.firstName,
      otp:       otp,
      church:    "Chapel of Praise — RCCG",
      expires_in:"5 minutes",
    },
  };

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(emailPayload),
  });

  if (!res.ok) {
    // Clean up Firestore if email fails
    await deleteDoc(pendingRef);
    throw new Error("Failed to send verification email. Please try again.");
  }

  return { maskedEmail: maskEmail(email) };
}

// ─── Step 2: Verify OTP & Create Account ─────────────────────────────────────
export async function verifyOTPAndCreateAccount(email, otpInput, password) {
  const pendingRef = doc(db, "pendingSignups", email.toLowerCase());
  const snapshot   = await getDoc(pendingRef);

  if (!snapshot.exists()) {
    throw new Error("Verification session expired. Please sign up again.");
  }

  const data = snapshot.data();

  // Expired?
  if (Date.now() > data.expiresAt) {
    await deleteDoc(pendingRef);
    throw new Error("Your OTP has expired. Please sign up again.");
  }

  // Too many attempts?
  if (data.attempts >= MAX_OTP_ATTEMPTS) {
    await deleteDoc(pendingRef);
    throw new Error("Too many incorrect attempts. Please sign up again.");
  }

  // Verify hash
  const inputHash = await hashOTP(otpInput.trim());
  if (inputHash !== data.hashedOTP) {
    // Increment attempts
    await setDoc(pendingRef, { ...data, attempts: data.attempts + 1 });
    const remaining = MAX_OTP_ATTEMPTS - data.attempts - 1;
    throw new Error(
      remaining > 0
        ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
        : "Too many incorrect attempts. Please sign up again."
    );
  }

  // ── OTP is valid — create the Firebase Auth user ──
  let userCredential;
  try {
    userCredential = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw new Error(firebaseAuthError(err.code));
  }

  const user = userCredential.user;

  // Update display name
  await updateProfile(user, { displayName: data.displayName });

  // Send Firebase email verification (optional extra layer)
  try { await sendEmailVerification(user); } catch (_) {}

  // Write user profile to Firestore
  try {
    await setDoc(doc(db, "users", user.uid), {
      uid:         user.uid,
      firstName:   data.firstName,
      lastName:    data.lastName,
      displayName: data.displayName,
      email:       email.toLowerCase(),
      phone:       data.phone,
      role:        "member",
      provider:    "email",
      emailVerified: false,
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp(),
    });
  } catch (firestoreErr) {
    // If Firestore write fails, delete the Auth user to avoid orphans
    await deleteUser(user);
    throw new Error("Account setup failed. Please try again.");
  }

  // Clean up pending record
  await deleteDoc(pendingRef);

  return user;
}

// ─── Google Sign-In ───────────────────────────────────────────────────────────
export async function signUpWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  provider.setCustomParameters({ prompt: "select_account" });

  let userCredential;
  try {
    userCredential = await signInWithPopup(auth, provider);
  } catch (err) {
    throw new Error(firebaseAuthError(err.code));
  }

  const user      = userCredential.user;
  const userRef   = doc(db, "users", user.uid);
  const existing  = await getDoc(userRef);

  // Only create profile if first time
  if (!existing.exists()) {
    const nameParts = (user.displayName || "").split(" ");
    await setDoc(userRef, {
      uid:         user.uid,
      firstName:   nameParts[0] || "",
      lastName:    nameParts.slice(1).join(" ") || "",
      displayName: user.displayName || "",
      email:       user.email?.toLowerCase() || "",
      phone:       "",
      role:        "member",
      provider:    "google",
      photoURL:    user.photoURL || "",
      emailVerified: true,
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp(),
    });
  }

  return user;
}

// ─── Firebase error code → human message ──────────────────────────────────────
export function firebaseAuthError(code) {
  const map = {
    "auth/email-already-in-use":     "An account with this email already exists.",
    "auth/invalid-email":            "The email address is not valid.",
    "auth/weak-password":            "Password is too weak. Use at least 8 characters.",
    "auth/user-not-found":           "No account found with this email.",
    "auth/wrong-password":           "Incorrect password.",
    "auth/too-many-requests":        "Too many attempts. Please try again later.",
    "auth/popup-closed-by-user":     "Google sign-in was cancelled.",
    "auth/popup-blocked":            "Pop-up was blocked. Allow pop-ups and try again.",
    "auth/network-request-failed":   "Network error. Check your connection.",
    "auth/internal-error":           "An internal error occurred. Please try again.",
    "auth/operation-not-allowed":    "This sign-in method is not enabled.",
  };
  return map[code] || "Something went wrong. Please try again.";
}
