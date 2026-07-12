import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { createUserWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import logo from './images/logos.png';
import { sendEmailVerification } from 'firebase/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
const [isEmailLoading, setIsEmailLoading] = useState(false);
const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSignup = async (e) => {
  e.preventDefault();
  const { firstName, lastName, email, phone, password, confirmPassword } = formData;
  const cleanPassword = password.trim();

  // 1. Basic Validation
  if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
    return toast.error("Please fill in all information.");
  }

  // 2. Password Strength Regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(cleanPassword)) {
    return toast.error("Password must be 8+ chars, with an uppercase, lowercase, number, and special character.");
  }
  if (cleanPassword !== confirmPassword.trim()) {
    return toast.error("Passwords do not match.");
  }

  // 3. Define Role Logic
  // If the password contains 'copRCCG', assign 'admin' role, otherwise 'user'
  const userRole = cleanPassword.includes("copRCCG") ? "admin" : "user";

  setIsEmailLoading(true);
  try {
    // 4. Create User in Firebase Auth
    const res = await createUserWithEmailAndPassword(auth, email.trim(), cleanPassword);
    await sendEmailVerification(res.user);

    // 5. Save user data + ROLE to Firestore
    await setDoc(doc(db, 'users', res.user.uid), {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: userRole, // <--- This saves the user's role
      createdAt: new Date().toISOString()
    });

    // Add this line:
await sendWelcomeEmail(email.trim(), firstName.trim());



    toast.success(`Account created as ${userRole}!`);
    setTimeout(() => navigate('/login'), 2500);
  } catch (err) {
    toast.error(err.code === 'auth/email-already-in-use' ? "Email already registered." : err.message);
  } finally {
    setIsEmailLoading(false);
  }
};



const sendWelcomeEmail = async (email, firstName) => {
  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         "api-key": import.meta.env.VITE_SENDINBLUE_API_KEY
      },
      body: JSON.stringify({
        sender: { name: "Chapel of Praise", email: "anjolaoluwaakintunde2@gmail.com" },
        to: [{ email: email }],
        templateId: 2, 
        params: { firstName: firstName } // Using lowercase 'firstName'
      })
    });
  } catch (err) {
    console.error("Welcome email failed", err);
  }
};



  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-md bg-white px-6 rounded-lg ">
        <div className="flex justify-center mb-0 -mt-7">
           <img src={logo} alt="Header" className="w-40 h-40 object-contain" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 -mt-9">Create new account</h1>
          <p className="text-gray-500 mb-8">Connect with our community and stay updated with our latest events.</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-4">
            <input name="firstName" onChange={handleChange} placeholder="First Name" className="w-full border-b border-gray-300 focus:border-green-800 focus:border-b transition-colors duration-200 outline-none py-2 " />
            <input name="lastName" onChange={handleChange} placeholder="Last Name" className="w-full border-b border-gray-300 focus:border-green-800 outline-none py-2 focus:border-b transition-colors duration-200" />
          {/* </div> */}
          <input name="email" type="email" onChange={handleChange} placeholder="Email" className="w-full border-b border-gray-300 focus:border-green-800 outline-none py-2 focus:border-b transition-colors duration-200" />
          <input name="phone" type="tel" onChange={handleChange} placeholder="Phone" className="w-full border-b border-gray-300 focus:border-green-800 outline-none py-2 focus:border-b transition-colors duration-200" />
          
          <div className="relative">
            <input name="password" type={showPassword ? "text" : "password"} onChange={handleChange} placeholder="Password" className="w-full border-b border-gray-300 focus:border-green-800 outline-none py-2 focus:border-b transition-colors duration-200" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-2 text-gray-400">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <div className="relative">
            <input name="confirmPassword" type={showConfirm ? "text" : "password"} onChange={handleChange} placeholder="Confirm Password" className="w-full border-b border-gray-300 focus:border-green-800 outline-none py-2 focus:border-b transition-colors duration-200" />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 top-2 text-gray-400">
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 py-4 ">
              By clicking Sign Up, you agree to our Church<span className="text-green-800 underline cursor-pointer"><br />Terms and Privacy Policy</span>.
            </p>
          </div>

        
     <button 
  type="submit" 
  disabled={isEmailLoading || isGoogleLoading} // Disable both if either is loading
  className="w-full bg-[#004A41] text-white py-3 rounded font-bold hover:bg-teal-950 transition flex items-center justify-center"
>
  {isEmailLoading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    "SIGN UP"
  )}
</button>
        </form>
 
 <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span onClick={() => navigate('/login')} className="text-teal-800 font-semibold cursor-pointer underline">Log in</span>
          </p>
        </div>


        <div className="mt-12 text-center text-gray-400 text-xs">
        <p className="font-bold text-gray-500">Chapel of Praise</p>
        <p className="my-2">Terms of Service | Privacy Policy</p>
        <p>© 2026 Chapel of Praise. All rights reserved.</p>
      </div>
      </div>

      
    </div>
  );
};

export default Signup;