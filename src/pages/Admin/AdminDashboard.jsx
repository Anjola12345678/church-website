
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Send,
  LayoutGrid,
  Mic,
  Layers,
  Calendar,
  User,
  Bell,
  ChevronRight,
  Clock,
  Loader2,
  Inbox,
} from 'lucide-react';

import { db, auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';


const QUICK_ACTIONS = [
  { key: 'admindashboard', label: 'Dashboard', icon: LayoutGrid, bg: 'bg-[#0F3B39]', fg: 'text-white', route: '/admin-dashboard' },
  { key: 'adminsermon', label: 'Sermon', icon: Mic, bg: 'bg-[#D7ECE7]', fg: 'text-[#0F3B39]', route: '/admin-sermon' },
  { key: 'adminquiz', label: 'Quizzes', icon: Layers, bg: 'bg-[#0F3B39]', fg: 'text-white', route: '/admin-quizzes' },
  { key: 'adminevents', label: 'Events', icon: Calendar, bg: 'bg-[#D7ECE7]', fg: 'text-[#0F3B39]', route: '/admin-events' },
  { key: 'adminprofile', label: 'Profile', icon: User, bg: 'bg-[#C2693E]', fg: 'text-white', route: '/admin-profile' },
  { key: 'adminnotifications', label: 'Notifications', icon: Bell, bg: 'bg-[#CFE8F2]', fg: 'text-[#0F3B39]', route: '/admin-notifications' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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

const isThisWeek = (timestamp) => {
  if (!timestamp) return false;
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return Date.now() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
};

/* ------------------------------------------------------------------ */
/*  Stat card                                                          */
/* ------------------------------------------------------------------ */

const StatCard = ({ icon: Icon, label, value, tint, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
  >
    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tint}`}>
      <Icon size={16} />
    </span>
    <p className="mt-3 text-[22px] font-bold leading-none text-slate-900">{value}</p>
    <p className="mt-1 text-[11px] font-semibold text-slate-400">{label}</p>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState(() => {
    return localStorage.getItem('adminFirstName') || '';
  });
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---- signed-in admin's name ---- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdminName('');
        localStorage.removeItem('adminFirstName');
        return;
      }

      try {
        const adminRef = doc(db, 'users', user.uid); // Change "users" if your admins are stored elsewhere
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          const data = adminSnap.data();
          const name = data.firstName || 'Admin';

          setAdminName(name);
          localStorage.setItem('adminFirstName', name);
        } else {
          setAdminName('Admin');
        }
      } catch (error) {
        console.error('Error loading admin:', error);
        setAdminName('Admin');
      }
    });

    return unsubscribe;
  }, []);

  /* ---- all sermons, newest first — powers both stats and the feed ---- */
  useEffect(() => {
    const q = query(collection(db, 'sermon'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setSermons(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('Failed to load sermons:', err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const stats = useMemo(() => {
    const published = sermons.filter((s) => s.status === 'PUBLISHED').length;
    const drafts = sermons.filter((s) => s.status === 'DRAFT').length;
    const thisWeek = sermons.filter((s) => isThisWeek(s.createdAt)).length;
    return { total: sermons.length, published, drafts, thisWeek };
  }, [sermons]);

  const recent = sermons.slice(0, 6);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const goTo = (route) => navigate(route);

  return (
    <div className="min-h-screen bg-[#F4F6F5]" id="top-anchor">
      <div className="mx-auto max-w-sm">
        {/* ---------------- Command header ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[28px] px-5 pt-8 pb-7 text-white"
          style={{ background: 'linear-gradient(160deg, #0C2F2C 0%, #081E1C 100%)' }}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-teal-300">
              <ShieldCheck size={11} /> Administrator
            </span>
            <span className="text-[10px] font-semibold text-teal-200/70">{today}</span>
          </div>

          <h1 className="mt-3 text-[26px] font-bold leading-tight">
            Welcome back,
            <br />
            {adminName}
          </h1>
          <p className="mt-1.5 text-[12px] text-teal-200/70">
            Here's what's happening across the ministry today.
          </p>
        </motion.div>

        {/* ---------------- Stats ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="px-5 pt-6"
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Overview
          </p>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={FileText}
              label="Total Sermons"
              value={loading ? '—' : stats.total}
              tint="bg-slate-100 text-slate-600"
              delay={0.02}
            />
            <StatCard
              icon={Send}
              label="Published"
              value={loading ? '—' : stats.published}
              tint="bg-emerald-50 text-emerald-600"
              delay={0.06}
            />
            <StatCard
              icon={FileText}
              label="Drafts"
              value={loading ? '—' : stats.drafts}
              tint="bg-amber-50 text-amber-600"
              delay={0.1}
            />
            <StatCard
              icon={Clock}
              label="Posted This Week"
              value={loading ? '—' : stats.thisWeek}
              tint="bg-teal-50 text-teal-700"
              delay={0.14}
            />
          </div>
        </motion.div>

        {/* ---------------- Quick Actions ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="px-5 pt-7"
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
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
                  <span className="text-[12px] font-medium text-slate-600">{action.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ---------------- Recent Activity ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className="mt-7 px-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-slate-900">Recent Activity</h2>
            <button
              onClick={() => goTo('/admin/sermons')}
              className="flex items-center gap-0.5 text-[12px] font-semibold text-teal-700"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {loading ? (
              <div className="flex flex-col items-center py-10">
                <Loader2 size={18} className="animate-spin text-teal-700" />
              </div>
            ) : recent.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 py-10 text-center">
                <Inbox size={18} className="text-slate-300" />
                <p className="text-[12px] text-slate-400">No sermons yet — post your first one.</p>
              </div>
            ) : (
              recent.map((sermon, i) => (
                <motion.button
                  key={sermon.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => goTo(`/admin/sermons/${sermon.id}`)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm active:scale-[0.99]"
                >
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {sermon.image && (
                      <img src={sermon.image} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-slate-900">
                      {sermon.title || 'Untitled sermon'}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {sermon.preacher || 'Unassigned'} · {timeAgo(sermon.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${
                      sermon.status === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {sermon.status}
                  </span>
                </motion.button>
              ))
            )}
          </div>
        </motion.div>

        {/* ---------------- Draft nudge ---------------- */}
        {!loading && stats.drafts > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.22 }}
            className="px-5 pb-8 pt-6"
          >
            <div
              className="relative overflow-hidden rounded-[22px] p-5 text-white shadow-md"
              style={{ background: 'linear-gradient(160deg, #0B1B2E 0%, #122A45 60%, #0B1B2E 100%)' }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-300">
                Needs Attention
              </span>
              <h3 className="mt-3 text-[16px] font-bold leading-snug">
                {stats.drafts} sermon{stats.drafts > 1 ? 's' : ''} sitting in draft
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed text-white/65">
                Finish and publish them so the congregation doesn't miss a message.
              </p>
              <button
                onClick={() => goTo('/admin/sermons')}
                className="mt-4 flex items-center gap-1 text-[12px] font-semibold text-teal-300"
              >
                Review drafts <ChevronRight size={13} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ---------------- Footer ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.26 }}
          className="px-5 pb-8 pt-2"
        >
          <div className="flex flex-col items-center gap-3 border-t border-slate-200 pt-6 text-center">
            <p className="text-[12px] font-medium italic text-slate-400">
              "Well done, good and faithful servant."
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
              Matthew 25:21 · Admin Console
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;








// <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 15px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
  
//   <!-- Header Section -->
//   <div style="background-color: #2c3e50; padding: 30px; text-align: center; color: #ffffff;">
//     <h1 style="margin: 0; font-size: 28px;">Chapel of Praise</h1>
//     <p style="margin: 5px 0 0; font-size: 16px; opacity: 0.9;">Spiritual Growth & Learning</p>
//   </div>

//   <!-- Content Section -->
//   <div style="padding: 30px; color: #333;">
//     <h2 style="color: #2c3e50; text-align: center;">New Quiz Available!</h2>
//     <p style="font-size: 16px;">Dear Church Family,</p>
//     <p style="font-size: 16px; line-height: 1.6;">Deepen your walk with God by testing your knowledge on this week’s message. We encourage everyone to participate.</p>
    
//     <!-- Details Box -->
//     <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #2c3e50;">
//      <p style="margin: 10px 0;"><strong>Topic:</strong> {{params.QUIZ_TITLE}}</p>
//   <p style="margin: 10px 0;"><strong>Date:</strong> {{params.QUIZ_DATE}}</p>
//   <p style="margin: 10px 0;"><strong>Duration:</strong> {{params.QUIZ_DURATION}} minutes</p>
//     </div>

//     <p style="font-style: italic; text-align: center; color: #555;">"Study to show thyself approved unto God..."</p>
    
//     <!-- Button -->
//     <div style="text-align: center; margin: 30px 0;">
//       <a href="#" style="background-color: #2c3e50; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Take the Quiz Now</a>
//     </div>
//   </div>

//   <!-- Footer -->
//   <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777;">
//     <p>You received this email because you are a member of Chapel of Praise.</p>
//     <p>&copy; 2026 Chapel of Praise. All rights reserved.</p>
//   </div>
// </div>