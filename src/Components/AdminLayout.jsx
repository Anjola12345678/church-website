import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { FaThLarge, FaBell, FaUser, FaMicrophone, FaQuestionCircle, FaHandsHelping, FaCalendarAlt, FaEnvelope, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import logos from './logos.png';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore'; // Import these
import { db } from '../firebase/config'; // Make sure you have your firestore instance
import { onAuthStateChanged } from 'firebase/auth'; // Import this
import { motion, AnimatePresence } from 'framer-motion';
import { IoLogOutOutline, IoMenuOutline, IoNotificationsOutline } from 'react-icons/io5';

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: 'User', email: 'user@example.com' });
  const [loading, setLoading] = useState(true);
// ... after your other useState declarations
const [isDesktop, setIsDesktop] = useState(() => 
  typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true
);

useEffect(() => {
  const mq = window.matchMedia('(min-width: 768px)');
  const update = () => setIsDesktop(mq.matches);
  
  update(); // Check on mount
  mq.addEventListener('change', update);
  
  return () => mq.removeEventListener('change', update);
}, []);


useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      setLoading(true);
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Security Check: Only allow if role is admin
          if (data.role === "admin") {
            setUserData(data);
          } else {
            navigate('/user-dashboard'); // Redirect users away
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false);
    } else {
      navigate('/login');
    }
  });

  return () => unsubscribe();
}, [navigate]);

const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate('/login');
  } catch (error) {
    console.error("Logout failed", error);
  }
};

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden">
      
      {/* 1. Backdrop Overlay */}
      {isOpen && <div className="fixed inset-0 md:hidden bg-black/20 z-40" onClick={() => setIsOpen(false)} />}

      {/* 2. Header (Mobile Only) */}
      <motion.header
  initial={{ y: -60, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.35, ease: 'easeOut' }}
  className="sticky top-0 z-30 shrink-0 md:hidden shadow-md"
  style={{ backgroundColor: '#0F3B39' }}
>
  <div className="flex items-center justify-between px-4 py-3.5">
    {/* Left: Menu Toggle */}
    <motion.button
      type="button"
      onClick={() => setIsOpen(true)}
      aria-label="Open menu"
      whileTap={{ scale: 0.88 }}
      className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:bg-white/10"
    >
      <IoMenuOutline size={24} />
    </motion.button>

    {/* Center: Branding */}
    {/* <div>
      <h1 className="font-serif text-xl italic text-[#D9C68A]">Admin Portal</h1>
    </div> */}
     {/* middle sec t*/}
          <div>
            <h1 className="font-serif text-2xl italic text-teal-700">Chapel Of Praise</h1>
           
          </div>

    {/* Right: Logout Action */}
    <motion.button
      type="button"
      onClick={() => setShowLogout(true)}
      aria-label="Log out"
      whileTap={{ scale: 0.88 }}
      className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:bg-white/10"
    >
      <IoLogOutOutline size={22} />
    </motion.button>
  </div>
</motion.header>

      {/* 3. Sidebar */}
      <aside className={`fixed md:static top-0 left-0 h-full w-64 bg-[#0F3B39] text-white z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 shadow-xl flex flex-col shrink-0`}>
        <div className="flex justify-center px-6 py-2">
          <img src={logos} alt="COP Logo" className="w-30 h-30 cursor-pointer " />
        </div>

        <nav className="-mt-5 flex-1 overflow-y-auto px-4 py- space-y-1 scrollbar-hide" onClick={() => setIsOpen(false)}>
          {[
            { to: "/admin-dashboard", icon: <FaThLarge />, label: "Dashboard" },
            { to: "/admin-notifications", icon: <FaBell />, label: "Notifications" },
            { to: "/admin-sermon", icon: <FaMicrophone />, label: "Sermons" },
            { to: "/admin-quizzes", icon: <FaQuestionCircle />, label: "Quizzes" },
            // { to: "/admin-prayers", icon: <FaHandsHelping />, label: "Prayer Requests" },
            { to: "/admin-events", icon: <FaCalendarAlt />, label: "Events" },
            // { to: "/admin-messages", icon: <FaEnvelope />, label: "Contact Messages" },
            // { to: "/admin-users", icon: <FaUsers />, label: "Users" },
            { to: "/admin-profile", icon: <FaUser />, label: "Profile" },
            // { to: "/admin-settings", icon: <FaCog />, label: "Settings" }
          ].map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-4 p-3 rounded-lg transition-all ${isActive ? 'bg-teal-900 text-white' : 'hover:bg-teal-900 text-white'}`}>
              {item.icon} {item.label}
            </NavLink>
          ))}
          <button onClick={() => setShowLogout(true)} className="flex w-full items-center gap-4 p-3 hover:bg-teal-900 hover:text-red-500 text-white rounded-lg">
            <FaSignOutAlt /> Logout
          </button>
        </nav>

        {/* Pinned Footer */}
{/* Pinned Footer */}
<div className="py-4 shrink-0 bg-[#0F3B39]">
  <div className="p-3 rounded-xl flex items-center gap-3 border border-teal-900/20">
    {/* Initials: Using first letter of FirstName and LastName */}
    <div className="w-10 h-10 bg-teal-900 text-white rounded-lg flex items-center justify-center font-bold">
      {loading ? "..." : `${userData?.firstName?.charAt(0) || ''}${userData?.lastName?.charAt(0) || ''}`.toUpperCase()}
    </div>
    
    {/* Content: Last Name at top, Email below */}
    <div className="overflow-hidden">
      <p className="font-bold text-sm truncate text-white">
        {loading ? "Loading..." : userData?.lastName || "Admin"}
      </p>
      <p className="text-[9px] text-white/70 truncate">
        {loading ? "..." : userData?.email || auth.currentUser?.email}
      </p>
    </div>
  </div>
</div>
      </aside>

      {/* 4. Main Content */}
      {/* flex-grow */}
      <main className="grow overflow-y-auto p-4 pb-24 md:pb-4">
        {children}
      </main>

      {/* 5. Bottom Navigation (Mobile Admin Links) */}
      <nav className="fixed bottom-0 w-full md:hidden bg-white border-t border-gray-200 flex justify-around items-center p-2 z-40 h-16">
        <NavLink to="/admin-dashboard" className={({ isActive }) => `flex flex-col items-center text-xs font-medium ${isActive ? 'text-teal-900' : 'text-gray-400'}`}>
          <FaThLarge size={20} /><span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin-users" className={({ isActive }) => `flex flex-col items-center text-xs font-medium ${isActive ? 'text-teal-900' : 'text-gray-400'}`}>
          <FaUsers size={20} /><span>Users</span>
        </NavLink>
        
        {/* Center Logo */}
        {/* -top-0 */}
        <div className="relative top-0"> 
          <img src={logos} alt="COP Logo" className="w-16 h-16 rounded-full" />
        </div>

        <NavLink to="/admin-events" className={({ isActive }) => `flex flex-col items-center text-xs font-medium ${isActive ? 'text-teal-900' : 'text-gray-400'}`}>
          <FaCalendarAlt size={20} /><span>Events</span>
        </NavLink>
        <NavLink to="/admin-settings" className={({ isActive }) => `flex flex-col items-center text-xs font-medium ${isActive ? 'text-teal-900' : 'text-gray-400'}`}>
          <FaCog size={20} /><span>Settings</span>
        </NavLink>
      </nav>

      {/* Logout Modal */}
      {showLogout && (
        // z-[100]
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white px-8 pt-8 pb-4 rounded-2xl shadow-xl w-full max-w-sm text-center">
            <img src={logos} alt="Logo" className="w-24 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Log Out?</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleLogout} className="w-full py-3 bg-[#0F3B39] text-white rounded-lg font-bold">Yes, Logout</button>
              <button onClick={() => setShowLogout(false)} className="w-full py-3 mb-4 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-[#0F3B39] hover:text-white">No, Stay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;




