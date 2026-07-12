

import { initializeApp } from "firebase/app";
import { initializeAuth, browserSessionPersistence } from "firebase/auth"; // Updated imports
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with Session Persistence
// This ensures the login session is unique to the tab
export const auth = initializeAuth(app, {
  persistence: browserSessionPersistence,
});

export const db = getFirestore(app);
export const storage = getStorage(app);