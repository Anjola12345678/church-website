
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  FaHome,
  FaThLarge,
  FaBook,
  FaBell,
  FaMicrophone,
  FaQuestionCircle,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaMicrophoneAlt,
} from 'react-icons/fa';
import logos from './logos.png';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { IoLogOutOutline, IoMenuOutline, IoNotificationsOutline } from 'react-icons/io5';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../Context/ThemeContext';
import AppearanceModal from './AppearanceModal';

const SIDEBAR_WIDTH = 256; // px — matches w-64

// Small red count pill used for the unread-notifications badge, wherever it shows up.
function CountBadge({ count, className = '' }) {
  if (!count || count <= 0) return null;
  return (
    <span
      className={`flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9.5px] font-bold leading-none text-white ${className}`}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeSidebar = () => setIsOpen(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  // App-wide light / sepia / dark theme — same state the Bible page (and
  // any other page) reads via useTheme().
  const { theme, themeKey } = useTheme();
  const ThemeIcon = theme.icon;

  const PAGE_TITLES = {
    '/user-dashboard': 'Home',
    '/bible': 'Bible',
    '/sermons': 'Sermons',
    '/quiz': 'Quiz',
    '/notifications': 'Notifications',
    '/events': 'Events',
    '/profile': 'Profile',
  };
  const pageTitle = PAGE_TITLES[location.pathname] || 'Home';

  // Tracks whether we're at the md breakpoint so the sidebar can switch
  // between "static column" (desktop) and "animated slide-in drawer" (mobile)
  // without fighting framer-motion's inline transform.
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // 1. Force the UI to show "Loading..." immediately when auth state changes
      setLoading(true);
      setUserData(null);

      if (user) {
        try {
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        navigate('/login');
      }
      setLoading(false); // Only set loading to false after the new data is fetched
    });

    return () => unsubscribe();
  }, [navigate]);

  // --------------------------------------------------------------------
  // Unread notifications badge — lives here (not in NotificationsPage)
  // since the sidebar/header need it visible on every screen of the app.
  // We compare every PUBLISHED notification against the current user's
  // per-user "read" records at users/{uid}/readNotifications, both live.
  // --------------------------------------------------------------------
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadNotifCount(0);
      return;
    }

    let publishedIds = [];
    let readIds = new Set();
    const recompute = () => {
      setUnreadNotifCount(publishedIds.filter((id) => !readIds.has(id)).length);
    };

    const notifQuery = query(collection(db, 'notifications'), where('status', '==', 'PUBLISHED'));
    const unsubNotifs = onSnapshot(
      notifQuery,
      (snap) => {
        publishedIds = snap.docs.map((d) => d.id);
        recompute();
      },
      (err) => console.error('Failed to load notifications for badge count:', err)
    );

    const unsubReads = onSnapshot(
      collection(db, 'users', user.uid, 'readNotifications'),
      (snap) => {
        readIds = new Set(snap.docs.map((d) => d.id));
        recompute();
      },
      (err) => console.error('Failed to load read-notifications for badge count:', err)
    );

    return () => {
      unsubNotifs();
      unsubReads();
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // This forces Firebase to clear the session
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const navItems = [
    { to: '/user-dashboard', label: 'Dashboard', icon: FaThLarge },
    { to: '/bible', label: 'Bible', icon: FaBook },
    { to: '/sermons', label: 'Sermons', icon: FaMicrophone },
    { to: '/quiz', label: 'Quiz', icon: FaQuestionCircle },
    { to: '/notifications', label: 'Notifications', icon: FaBell, badge: unreadNotifCount },
    { to: '/events', label: 'Events', icon: FaCalendarAlt },
    { to: '/profile', label: 'Profile', icon: FaUser },
  ];

  const bottomNavItems = [
    { to: '/user-dashboard', label: 'Home', icon: FaHome },
    { to: '/sermons', label: 'Sermons', icon: FaMicrophoneAlt },
  ];

  const bottomNavItemsRight = [
    { to: '/quiz', label: 'Quiz', icon: FaQuestionCircle },
    { to: '/events', label: 'Events', icon: FaCalendarAlt },
  ];



  const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: -256, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  desktop: { x: 0, transition: { duration: 0 } } // No animation for desktop
};
  return (
    <div className={`h-screen flex flex-col md:flex-row overflow-hidden transition-colors ${theme.pageBg}`}>

      {/* 1. Backdrop Overlay (mobile only, fades in/out with the sidebar) */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* 2. Header (mobile only) — dark app bar with page title, appearance, notifications, logout */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="sticky top-0 z-30 shrink-0 md:hidden shadow-md"
        style={{ backgroundColor: '#0F3B39' }}
      >
        <div className="flex items-center justify-between px-4 py-3.5">
          {/* Left: menu + page title */}
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              whileTap={{ scale: 0.88 }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:bg-white/10"
            >
              <IoMenuOutline size={24} />
            </motion.button>
            {/* <span className="text-[16px] font-semibold text-white">{pageTitle}</span> */}
          </div>

          {/* middle sec t*/}
          <div>
            <h1 className="font-serif text-2xl italic text-teal-700">Chapel Of Praise</h1>
           
          </div>

          {/* Right: appearance + notifications + logout */}
          <div className="flex items-center gap-1">
            <motion.button
              type="button"
              onClick={() => setShowAppearance(true)}
              aria-label="Appearance settings"
              whileTap={{ scale: 0.88 }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:bg-white/10"
            >
              <ThemeIcon size={20} />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
              whileTap={{ scale: 0.88 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:bg-white/10"
            >
              <IoNotificationsOutline size={21} />
              {unreadNotifCount > 0 && (
                <CountBadge
                  count={unreadNotifCount}
                  className="absolute right-1 top-1 ring-2 ring-[#0F3B39]"
                />
              )}
            </motion.button>
            {/* <motion.button
              type="button"
              onClick={() => setShowLogout(true)}
              aria-label="Log out"
              whileTap={{ scale: 0.88 }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:bg-white/10"
            >
              <IoLogOutOutline size={22} />
            </motion.button> */}
          </div>
        </div>
      </motion.header>

      {/* 3. Sidebar — static column on desktop, animated slide-in drawer on mobile */}
      <motion.aside
  variants={sidebarVariants}
  animate={isDesktop ? 'desktop' : (isOpen ? 'open' : 'closed')}
  className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0F3B39] text-teal-900 shadow-xl flex flex-col shrink-0 md:static"
>
        {/* Pinned Title */}
        <div className="flex justify-center px-8">
          <img src={logos} alt="COP Logo" className="w-30 h-30 cursor-pointer" />
        </div>

        {/* Scrollable Nav Area */}
        <nav className="-mt-5 flex-1 overflow-y-auto px-4 py- space-y-1 scrollbar-hide" onClick={closeSidebar}>
          {navItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg transition-all font-semibold ${
                  isActive ? 'text-white bg-teal-900' : 'hover:bg-teal-900 text-white'
                }`
              }
            >
              <span className="relative flex items-center justify-center">
                <Icon />
                {badge > 0 && (
                  <CountBadge count={badge} className="absolute -right-2 -top-2 ring-2 ring-[#0F3B39]" />
                )}
              </span>
              {label}
            </NavLink>
          ))}

          {/* Appearance — desktop entry point, since the mobile header icon
              isn't visible on the static desktop layout's own chrome */}
          {/* <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowAppearance(true);
            }}
            className="flex w-full items-center gap-4 p-3 hover:bg-teal-900 text-white rounded-lg"
          >
            <ThemeIcon size={16} /> Appearance
          </motion.button> */}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowLogout(true)}
            className="flex w-full items-center gap-4 p-3 hover:bg-teal-900 hover:text-red-500 text-white rounded-lg"
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </nav>

        {/* Pinned Footer */}
        <div className="p-3 rounded-xl flex items-center gap-3 border border-teal-900/20 m-3">
          <div className="w-10 h-10 bg-teal-900 text-white rounded-lg flex items-center justify-center font-bold">
            {loading ? '...' : `${userData?.firstName?.charAt(0) || ''}${userData?.lastName?.charAt(0) || ''}`.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate text-white">
              {loading ? 'Loading...' : userData?.lastName || 'Member'}
            </p>
            <p className="text-[9px] text-white/70 truncate">
              {loading ? '...' : auth.currentUser?.email}
            </p>
          </div>
        </div>
      </motion.aside>

      {/* 4. Main Content — themed so every page shifts with the app-wide theme */}
      {/* <main className={`grow overflow-y-auto pb-24 md:pb-4 transition-colors ${theme.pageBg} ${theme.text}`}>
        {children}
      </main> */}
      <main className={`grow overflow-y-auto ${theme.pageBg} ${theme.text} w-full`}>
  {children}
</main>

      {/* 5. Bottom Navigation (mobile only) */}
      <nav
        className={`fixed bottom-0 w-full md:hidden border-t flex justify-around items-center p-2 z-40 h-16 transition-colors ${theme.cardBg} ${theme.border}`}
      >
        {bottomNavItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs font-medium ${isActive ? 'text-teal-900' : 'text-gray-400'}`
            }
          >
            {({ isActive }) => (
              <motion.div whileTap={{ scale: 0.88 }} className="flex flex-col items-center">
                <Icon size={20} />
                <span>{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}

        {/* Center Logo */}
        <div className="relative top-0">
          <img src={logos} alt="COP Logo" className="w-16 h-16 rounded-full" />
        </div>

        {bottomNavItemsRight.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs font-medium ${isActive ? 'text-teal-900' : 'text-gray-400'}`
            }
          >
            {({ isActive }) => (
              <motion.div whileTap={{ scale: 0.88 }} className="flex flex-col items-center">
                <Icon size={20} />
                <span>{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Appearance Modal */}
      <AnimatePresence>
        {showAppearance && <AppearanceModal onClose={() => setShowAppearance(false)} />}
      </AnimatePresence>

      {/* Logout Modal Overlay */}
      <AnimatePresence>
        {showLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white px-8 pt-6 rounded-2xl shadow-xl w-[90%] max-w-sm text-center"
            >
              <img src={logos} alt="Logo" className="w-40 mx-auto" />
              <h2 className="text-xl font-bold mb-2 -mt-5">Log Out?</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full py-3 bg-slate-800 text-white rounded-md font-medium text-sm hover:bg-slate-900 transition-all"
                >
                  Yes, Logout
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLogout(false)}
                  className="w-full py-3 mb-7 border border-slate-200 rounded-md font-medium text-sm text-slate-600 bg-slate-200 transition-all"
                >
                  No, Stay
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
