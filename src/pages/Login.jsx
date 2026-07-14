import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import logo from './images/logos.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
const handleLogin = async (e) => {
  e.preventDefault();
  if (!formData.email || !formData.password) {
    return toast.error("Please fill in all fields.");
  }
  setLoading(true);
  try {
    // 1. Sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password.trim());
    const user = userCredential.user;

    // 2. Fetch the user role from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const role = userData.role;

      // 3. Navigate based on role
      if (role === 'admin') {
        toast.success("Welcome, Admin!");
        navigate('/admin-dashboard');
      } else {
        toast.success("Welcome back!");
        navigate('/user-dashboard');
      }
    } else {
      toast.error("User data not found.");
    }
  } catch (err) {
    toast.error("Invalid email or password.");
  } finally {
    setLoading(false);
  }
};



  const handleForgotPassword = async () => {
    if (!formData.email) {
      return toast.error("Please enter your email address above to reset your password.");
    }
    try {
      await sendPasswordResetEmail(auth, formData.email.trim());
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err) {
      toast.error("Error sending reset email: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Login successful!");
      navigate('/landing');
    } catch (err) {
      toast.error("Google login failed.");
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center p-2 bg-white">
      <div className="w-full max-w-md bg-white px-6 rounded-lg">
        <div className="flex justify-center mb-0">
           <img src={logo} alt="Logo" className="w-40 h-40 object-contain" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 -mt-9">Welcome Back</h1>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input name="email" type="email" onChange={handleChange} placeholder="Email" className="w-full border-b border-gray-300 focus:border-teal-800 outline-none py-2" />
          
          <div className="relative">
            <input name="password" type={showPassword ? "text" : "password"} onChange={handleChange} placeholder="Password" className="w-full border-b border-gray-300 focus:border-teal-800 outline-none py-2" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-2 text-gray-400">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          {/* Forgot Password Link */}
          <div className="text-center">
            <button type="button" onClick={handleForgotPassword} className="text-xs text-teal-800 font-semibold underline cursor-pointer">
              Forgot password?
            </button>
          </div>

          <button 
  type="submit" 
  disabled={loading} 
  className="w-full bg-[#004A41] text-white py-3 rounded font-bold hover:bg-teal-950 transition mt-2 flex items-center justify-center"
>
  {loading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    "LOG IN"
  )}
</button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span onClick={() => navigate('/signup')} className="text-teal-800 font-semibold cursor-pointer underline">Sign up</span>
          </p>
        </div>
      </div>

       <div className="mt-20 text-center text-gray-400 text-xs">
        <p className="font-bold text-gray-500">Chapel of Praise</p>
        <p className="my-2">Terms of Service | Privacy Policy</p>
        <p>© 2026 Chapel of Praise. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;