import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  BookOpen,
  Layers,
  User,
  LayoutGrid,
  Mic,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useTheme } from '../../Context/ThemeContext';
import { db, auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';



const QUICK_ACTIONS = [
  { key: 'event', label: 'Event', icon: Calendar, bg: 'bg-[#0F3B39]', fg: 'text-white', route: '/events' },
  { key: 'bible', label: 'Bible', icon: BookOpen, bg: 'bg-[#D7ECE7]', fg: 'text-[#0F3B39]', route: '/bible' },
  { key: 'quiz', label: 'Quiz', icon: Layers, bg: 'bg-[#0F3B39]', fg: 'text-white', route: '/quiz' },
  { key: 'profile', label: 'Profile', icon: User, bg: 'bg-[#C2693E]', fg: 'text-white', route: '/profile' },
  { key: '/user-dashboard', label: 'Dashboard', icon: LayoutGrid, bg: 'bg-[#D7ECE7]', fg: 'text-[#0F3B39]', route: '/user-dashboard' },
  { key: 'sermon', label: 'Sermon', icon: Mic, bg: 'bg-[#CFE8F2]', fg: 'text-[#0F3B39]', route: '/sermons' },
];


function timeAgo(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return `${diffWeek}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function firstName(name = '') {
  return name.trim().split(' ')[0] || name;
}


const UserDashboard = () => {
  const navigate = useNavigate();
  const { theme, themeKey, fontSize } = useTheme();

  // const [userName, setUserName] = useState("");
  const [userName, setUserName] = useState(() => {
  return localStorage.getItem("userFirstName") || "";
});


  const [sermons, setSermons] = useState([]);
  const [sermonsLoading, setSermonsLoading] = useState(true);

  /* ---- real signed-in user's name ---- */

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setUserName("Friend");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
  const data = userSnap.data();

  const name = data.firstName || "Friend";

  setUserName(name);
  localStorage.setItem("userFirstName", name);
} else {
  setUserName("Friend");
}
    } catch (error) {
      console.error("Error loading user:", error);
      setUserName("Friend");
    }
  });

  return unsubscribe;
}, []);

  /* ---- last 5 published sermons, live ---- */
  useEffect(() => {
    const q = query(
      collection(db, 'sermon'),
      where('status', '==', 'PUBLISHED'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setSermons(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setSermonsLoading(false);
      },
      (err) => {
        console.error('Failed to load sermons:', err);
        setSermonsLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const goTo = (route) => navigate(route);

  const skeletonBg = themeKey === 'dark' ? 'bg-slate-700' : 'bg-slate-200';

  return (
    <div className={`min-h-screen transition-colors ${theme.pageBg}`}>
        {/* ---------------- Greeting header ---------------- */}
        {/* <motion.div
  initial={{ opacity: 0, y: -8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35 }}
className="relative w-full left-0 right-0 px-5 pt-8 mt-0 pb-7 text-white "
  style={{ background: 'linear-gradient(160deg, #11433F 0%, #0C2F2C 100%)' }}
>
  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-200/80">
    Peace Be With You
  </p>

  <h1 className="mt-1 text-[26px] font-bold leading-tight">
    Good Morning,
    <br />
    {userName}
  </h1>

  <div className="mt-5 rounded-2xl bg-white/10 px-4 py-3.5 backdrop-blur-sm">
    <p className="text-[13px] italic leading-relaxed text-white/90">
      <span className="mr-1 text-teal-300">"</span>
      The Lord is my shepherd; I shall not want.
      <span className="ml-1 text-teal-300">"</span>
    </p>
    <p className="mt-1.5 text-right text-[11px] font-semibold text-teal-200/80">
      — Psalm 23:1
    </p>
  </div>
</motion.div> */}



<motion.div
  initial={{ opacity: 0, y: -8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35 }}
  className="relative w-full left-0 right-0 px-5 pt-8 mt-0 pb-7 bg-mist-100  shadow-[0_8px_24px_-4px_rgba(15,59,57,0.12)]"
>
  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700/70">
    Peace Be With You
  </p>

  <h1 className="mt-1 text-[26px] font-bold leading-tight text-[#0F3B39]">
    Good Morning,
    <br />
    {userName}
  </h1>

  <div className="mt-5 rounded-2xl  bg-teal-900 text-white px-4 py-3.5 border border-[#0F3B39]/10">
    <p className="text-[13px] italic leading-relaxed ">
      <span className="mr-1 text-white">"</span>
      The Lord is my shepherd; I shall not want.
      <span className="ml-1 text-white">"</span>
    </p>
    <p className="mt-1.5 text-right text-[11px] font-semibold text-white">
      — Psalm 23:1
    </p>
  </div>
</motion.div>




        {/* ---------------- Quick Actions ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="px-5 pt-6"
        >
          <p className={`mb-3 text-[11px] font-bold uppercase tracking-[0.16em] ${theme.subText}`}>
            Quick Actions
          </p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => goTo(action.route)}
                  className="flex flex-col items-center gap-2 active:opacity-80"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${action.bg} ${action.fg}`}
                  >
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <span className={`text-[12px] font-medium ${theme.text}`}>{action.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ---------------- Latest Sermons ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          className="mt-7"
        >
          <div className="flex items-center justify-between px-5">
            <h2 className={`text-[16px] font-bold ${theme.heading}`}>Latest Sermons</h2>
            <button
              onClick={() => goTo('/sermons')}
              className={`flex items-center gap-0.5 text-[12px] font-semibold ${theme.verseNum}`}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sermonsLoading ? (
              [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-[168px] w-[230px] shrink-0 animate-pulse overflow-hidden rounded-2xl border shadow-sm ${theme.border} ${theme.cardBg}`}
                >
                  <div className={`h-28 w-full ${skeletonBg}`} />
                  <div className="space-y-2 p-3">
                    <div className={`h-2 w-16 rounded ${skeletonBg}`} />
                    <div className={`h-3 w-32 rounded ${skeletonBg}`} />
                    <div className={`h-2 w-20 rounded ${skeletonBg}`} />
                  </div>
                </div>
              ))
            ) : sermons.length === 0 ? (
              <div className="flex w-full items-center justify-center py-8">
                <p className={`text-[12px] ${theme.subText}`}>No sermons posted yet.</p>
              </div>
            ) : (
              sermons.map((sermon) => (
                <button
                  key={sermon.id}
                  onClick={() => goTo('/sermons')}
                  className={`w-[230px] shrink-0 overflow-hidden rounded-2xl border text-left shadow-sm active:scale-[0.99] ${theme.border} ${theme.cardBg}`}
                >
                  <div className="relative h-28 w-full">
                    <img src={sermon.image} alt={sermon.title} className="h-full w-full object-cover" />
                    <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      <Clock size={10} /> {timeAgo(sermon.createdAt)}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className={`truncate text-[9px] font-bold uppercase tracking-[0.1em] ${theme.verseNum}`}>
                      Service Type: {sermon.serviceType}
                    </p>
                    <h3 className={`mt-1 truncate text-[14px] font-bold ${theme.text}`}>{sermon.title}</h3>
                    <p className={`mt-0.5 truncate text-[11px] ${theme.subText}`}>{sermon.preacher}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>

        {/* ---------------- Ministry News ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="px-5 pb-8 pt-6"
        >
          <div
            className="relative overflow-hidden rounded-[22px] p-5 text-white shadow-md"
            style={{ background: 'linear-gradient(160deg, #0B1B2E 0%, #122A45 60%, #0B1B2E 100%)' }}
          >
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=600&auto=format&fit=crop')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2E] via-[#0B1B2E]/70 to-transparent" />

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-teal-300">
                Ministry News
              </span>
              <h3 className="mt-3 text-[16px] font-bold leading-snug">
                Expanding Our Reach: New Community Outreach Program
              </h3>
              <p className={`mt-2 ${fontSize.bodyClass} leading-relaxed text-white/65`}>
                Discover how we are making a difference in the local community...
              </p>
            </div>
          </div>
        </motion.div>

        {/* ---------------- Footer ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.26 }}
          className="px-5 pb-0 pt-2 mb-23 "
        >
          <div className={`flex flex-col items-center gap-3 text-center ${theme.border} `}>
            <p className={`text-[12px] font-medium italic ${theme.subText} text-black`}>
              "Where two or three gather in my name, there am I in the midst of them."
            </p>
            <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${theme.subText}`}>
              Matthew 18:20 · Grace Fellowship
            </p>
          </div>
        </motion.div>
      {/* </div> */}
    </div>
  );
};

export default UserDashboard;

