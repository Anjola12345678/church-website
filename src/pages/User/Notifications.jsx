
// import React, { useEffect, useMemo, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Search,
//   ArrowLeft,
//   MoreVertical,
//   AlertTriangle,
//   Megaphone,
//   HeartHandshake,
//   GraduationCap,
//   Calendar,
//   Bell,
//   CheckCircle2,
//   Archive,
//   Share2,
//   Star,
//   AlertCircle,
//   Loader2,
//   Inbox,
// } from 'lucide-react';

// // ---------------------------------------------------------------------
// // Firebase — same `db`/`auth` exports used across the app.
// // ---------------------------------------------------------------------
// import { db, auth } from '../../firebase/config';
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   doc,
//   setDoc,
//   serverTimestamp,
// } from 'firebase/firestore';
// import { onAuthStateChanged } from 'firebase/auth';
// import { useTheme } from '../../Context/ThemeContext';
// /* ------------------------------------------------------------------ */
// /*  Category → icon/color lookup                                       */
// /*  Firestore only stores the `category` string (e.g. "alert"), so      */
// /*  this maps it back to the icon + colors for display. Keep this in   */
// /*  sync with the CATEGORIES list in the admin composer.                */
// /* ------------------------------------------------------------------ */

// const CATEGORY_META = {
//   alert:       { icon: AlertTriangle,  accentBg: 'bg-rose-50',    accentFg: 'text-rose-600',    barColor: 'bg-rose-400' },
//   update:      { icon: Megaphone,      accentBg: 'bg-sky-50',     accentFg: 'text-sky-600',     barColor: 'bg-sky-400' },
//   prayer:      { icon: HeartHandshake, accentBg: 'bg-amber-50',   accentFg: 'text-amber-600',   barColor: 'bg-amber-400' },
//   celebration: { icon: GraduationCap,  accentBg: 'bg-violet-50',  accentFg: 'text-violet-600',  barColor: 'bg-violet-400' },
//   event:       { icon: Calendar,       accentBg: 'bg-orange-50',  accentFg: 'text-orange-600',  barColor: 'bg-orange-400' },
//   general:     { icon: Bell,           accentBg: 'bg-slate-100',  accentFg: 'text-slate-600',   barColor: 'bg-slate-300' },
// };

// const categoryMeta = (category) => CATEGORY_META[category] || CATEGORY_META.general;

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                            */
// /* ------------------------------------------------------------------ */

// function toDate(value) {
//   if (!value) return new Date();
//   return value.toDate ? value.toDate() : new Date(value);
// }

// function timeAgo(date) {
//   const diffMs = Date.now() - date.getTime();
//   const diffMin = Math.floor(diffMs / 60000);
//   if (diffMin < 1) return 'Just now';
//   if (diffMin < 60) return `${diffMin}m ago`;
//   const diffHr = Math.floor(diffMin / 60);
//   if (diffHr < 24) return `${diffHr}h ago`;
//   const diffDay = Math.floor(diffHr / 24);
//   if (diffDay === 1) return 'Yesterday';
//   if (diffDay < 7) return `${diffDay}d ago`;
//   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// }

// function fullTimeAgo(date) {
//   const diffMs = Date.now() - date.getTime();
//   const diffHr = Math.floor(diffMs / 3600000);
//   if (diffHr < 1) return 'Just now';
//   if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
//   const diffDay = Math.floor(diffHr / 24);
//   return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
// }

// function groupLabel(date) {
//   const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
//   const today = startOf(new Date());
//   const target = startOf(date);
//   const diffDays = Math.round((today - target) / 86400000);
//   if (diffDays === 0) return 'TODAY';
//   if (diffDays === 1) return 'YESTERDAY';
//   if (diffDays <= 7) return 'EARLIER THIS WEEK';
//   return 'EARLIER';
// }

// function initials(name = '') {
//   return name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
// }

// /* Renders body text, turning **bold** segments into <strong> */
// function RichBody({ text }) {
//   const paragraphs = text.split('\n\n');
//   return (
//     <>
//       {paragraphs.map((para, pi) => {
//         const parts = para.split(/(\*\*.*?\*\*)/g).filter(Boolean);
//         return (
//           <p key={pi} className="mb-4 text-[14px] leading-relaxed text-slate-600 last:mb-0">
//             {parts.map((part, i) =>
//               part.startsWith('**') && part.endsWith('**') ? (
//                 <strong key={i} className="font-bold text-slate-900">
//                   {part.slice(2, -2)}
//                 </strong>
//               ) : (
//                 <React.Fragment key={i}>{part}</React.Fragment>
//               )
//             )}
//           </p>
//         );
//       })}
//     </>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  List row                                                            */
// /* ------------------------------------------------------------------ */

// function NotificationRow({ item, index, onSelect, onToggleFavorite }) {
//   const { icon: Icon, accentBg, accentFg, barColor } = categoryMeta(item.category);
//   return (
//     <motion.button
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.04, duration: 0.2 }}
//       onClick={() => onSelect(item)}
//       className="group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white p-3.5 pl-4 text-left shadow-sm transition-shadow hover:shadow-md active:scale-[0.99]"
//     >
//       <span className={`absolute left-0 top-0 h-full w-1 ${barColor}`} />

//       <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentBg} ${accentFg}`}>
//         <Icon size={18} />
//       </span>

//       <div className="min-w-0 flex-1">
//         <div className="flex items-start justify-between gap-2">
//           <h3 className={`text-[14px] leading-snug ${item.isRead ? 'font-semibold' : 'font-bold'} text-slate-900`}>
//             {item.title}
//           </h3>
//           <div className="flex shrink-0 items-center gap-1 pt-0.5">
//             {!item.isRead && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
//             <span className="text-[10px] font-medium text-slate-400">{timeAgo(item.createdAt)}</span>
//           </div>
//         </div>
//         <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-slate-500">{item.body}</p>
//         {item.highPriority && (
//           <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-rose-50 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-rose-600">
//             <AlertCircle size={9} /> High Priority
//           </span>
//         )}
//       </div>

//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           onToggleFavorite(item.id);
//         }}
//         className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-slate-300 opacity-0 transition-opacity hover:text-amber-500 group-hover:opacity-100"
//       >
//         <Star size={13} fill={item.isFavorite ? 'currentColor' : 'none'} className={item.isFavorite ? 'text-amber-500 opacity-100' : ''} />
//       </button>
//     </motion.button>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  List screen                                                         */
// /* ------------------------------------------------------------------ */

// const TABS = [
//   { key: 'all', label: 'All' },
//   { key: 'favorite', label: 'Favorite' },
//   { key: 'archived', label: 'Archived' },
// ];

// function NotificationsList({ notifications, loading, onSelect, onToggleFavorite }) {
//   const [tab, setTab] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   const unreadTotal = useMemo(
//     () => notifications.filter((n) => !n.isRead && !n.isArchived).length,
//     [notifications]
//   );

//   const filtered = useMemo(() => {
//     let list = notifications;
//     if (tab === 'favorite') list = list.filter((n) => n.isFavorite && !n.isArchived);
//     else if (tab === 'archived') list = list.filter((n) => n.isArchived);
//     else list = list.filter((n) => !n.isArchived);

//     const term = searchTerm.trim().toLowerCase();
//     if (term) {
//       list = list.filter(
//         (n) => n.title.toLowerCase().includes(term) || n.body.toLowerCase().includes(term)
//       );
//     }
//     return list;
//   }, [notifications, tab, searchTerm]);

//   const grouped = useMemo(() => {
//     const groups = {};
//     filtered.forEach((n) => {
//       const label = groupLabel(n.createdAt);
//       if (!groups[label]) groups[label] = [];
//       groups[label].push(n);
//     });
//     const order = ['TODAY', 'YESTERDAY', 'EARLIER THIS WEEK', 'EARLIER'];
//     return order.filter((label) => groups[label]?.length).map((label) => [label, groups[label]]);
//   }, [filtered]);

//   return (
//     <div className="min-h-screen bg-[#F4F6F5] pb-10">
//       <div className="mx-auto max-w-md px-5 pt-6">
//         {/* Header */}
//         <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//           <div className="flex items-center justify-between">
//             <h1 className="text-[22px] font-bold text-slate-900">Notifications</h1>
//             {unreadTotal > 0 && (
//               <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600">
//                 <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
//                 {unreadTotal} unread
//               </span>
//             )}
//           </div>
//           <p className="mt-1 text-[13px] text-slate-500">
//             Stay informed with important church updates and announcements.
//           </p>
//         </motion.div>

//         {/* Search */}
//         <motion.div
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.05 }}
//           className="relative mt-4"
//         >
//           <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search notices..."
//             className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
//           />
//         </motion.div>

//         {/* Tabs */}
//         <motion.div
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//           className="mt-4 flex gap-2"
//         >
//           {TABS.map((t) => (
//             <button
//               key={t.key}
//               onClick={() => setTab(t.key)}
//               className={`relative rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-colors ${
//                 tab === t.key ? 'text-white' : 'bg-white text-slate-500 border border-slate-200'
//               }`}
//             >
//               {tab === t.key && (
//                 <motion.span
//                   layoutId="notif-tab-pill"
//                   className="absolute inset-0 rounded-full bg-teal-700"
//                   transition={{ type: 'spring', stiffness: 500, damping: 40 }}
//                 />
//               )}
//               <span className="relative">{t.label}</span>
//             </button>
//           ))}
//         </motion.div>

//         {/* List */}
//         <div className="mt-5 space-y-5">
//           {loading ? (
//             <div className="flex flex-col items-center py-16">
//               <Loader2 size={20} className="animate-spin text-teal-700" />
//               <p className="mt-3 text-[12px] text-slate-400">Loading notifications…</p>
//             </div>
//           ) : grouped.length === 0 ? (
//             <div className="flex flex-col items-center gap-2 py-16 text-center">
//               <Inbox size={18} className="text-slate-300" />
//               <p className="text-[13px] text-slate-400">Nothing here yet.</p>
//             </div>
//           ) : (
//             grouped.map(([label, items]) => (
//               <div key={label}>
//                 <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
//                   {label}
//                 </p>
//                 <div className="space-y-2.5">
//                   {items.map((item, i) => (
//                     <NotificationRow
//                       key={item.id}
//                       item={item}
//                       index={i}
//                       onSelect={onSelect}
//                       onToggleFavorite={onToggleFavorite}
//                     />
//                   ))}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Detail screen                                                       */
// /* ------------------------------------------------------------------ */

// function NotificationDetail({ item, onBack, onArchive }) {
//   const { icon: Icon, accentBg, accentFg } = categoryMeta(item.category);
//   return (
//     <motion.div
//       key="detail"
//       initial={{ opacity: 0, x: 40 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 40 }}
//       transition={{ duration: 0.25 }}
//       className="min-h-screen bg-[#F4F6F5]"
//     >
//       {/* Top bar */}
//       <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3.5 backdrop-blur-sm">
//         <button
//           onClick={onBack}
//           className="flex h-8 w-8 items-center justify-center rounded-full text-teal-700 hover:bg-teal-50"
//         >
//           <ArrowLeft size={18} />
//         </button>
//         <h1 className="text-[15px] font-bold text-teal-700">Notification</h1>
//         <button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50">
//           <MoreVertical size={18} />
//         </button>
//       </div>

//       <div className="mx-auto max-w-md px-5 pb-10 pt-5">
//         {/* Hero card */}
//         <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
//           <div className="flex items-start gap-3">
//             <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accentBg} ${accentFg}`}>
//               <Icon size={22} />
//             </span>
//             <div className="min-w-0 flex-1">
//               <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
//                 {item.badgeLabel && (
//                   <span className="rounded-md bg-teal-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
//                     {item.badgeLabel}
//                   </span>
//                 )}
//                 {item.highPriority && (
//                   <span className="flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600">
//                     <AlertCircle size={10} /> High Priority
//                   </span>
//                 )}
//                 <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
//                   <CheckCircle2 size={10} /> Read
//                 </span>
//               </div>
//               <h2 className="text-[19px] font-bold leading-snug text-slate-900">{item.title}</h2>
//               <p className="mt-1 text-[11.5px] font-medium text-slate-400">{fullTimeAgo(item.createdAt)}</p>
//             </div>
//           </div>

//           <div className="my-4 h-px bg-slate-100" />

//           <div className="flex items-center gap-3">
//             <span className={`flex h-9 w-9 items-center justify-center rounded-full ${accentBg} ${accentFg} text-[12px] font-bold`}>
//               {initials(item.sender?.name)}
//             </span>
//             <div className="min-w-0">
//               <p className="truncate text-[13px] font-bold text-slate-900">{item.sender?.name}</p>
//               <p className="truncate text-[11px] text-slate-400">{item.sender?.role}</p>
//             </div>
//           </div>
//         </div>

//         {/* Body card */}
//         <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
//           <RichBody text={item.body} />
//         </div>

//         {/* Actions */}
//         <div className="mt-5 flex gap-2.5">
//           <motion.button
//             whileTap={{ scale: 0.98 }}
//             onClick={() => onArchive(item.id)}
//             className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-3 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
//           >
//             <Archive size={14} /> {item.isArchived ? 'Unarchive' : 'Archive'}
//           </motion.button>
//           <motion.button
//             whileTap={{ scale: 0.98 }}
//             className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-3 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
//           >
//             <Share2 size={14} /> Share
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Root                                                                */
// /* ------------------------------------------------------------------ */

// const NotificationsPage = () => {
//   const [uid, setUid] = useState(null);
//   const [rawNotifications, setRawNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedId, setSelectedId] = useState(null);

//   // Read state is persisted per-user in Firestore at
//   // users/{uid}/readNotifications/{notificationId} so it (a) survives across
//   // devices/sessions and (b) can be read by other parts of the app — like the
//   // unread badge in DashboardLayout's sidebar — via the same collection.
//   const [readIds, setReadIds] = useState(new Set());

//   // Favorite/Archive stay device-local for now since they're just personal
//   // organizing tools, not something that needs to sync or be counted elsewhere.
//   const [localState, setLocalState] = useState({});

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => setUid(user ? user.uid : null));
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const q = query(
//       collection(db, 'notifications'),
//       where('status', '==', 'PUBLISHED'),
//       orderBy('createdAt', 'desc')
//     );
//     const unsubscribe = onSnapshot(
//       q,
//       (snap) => {
//         setRawNotifications(
//           snap.docs.map((d) => {
//             const data = d.data();
//             return { id: d.id, ...data, createdAt: toDate(data.createdAt) };
//           })
//         );
//         setLoading(false);
//       },
//       (err) => {
//         console.error('Failed to load notifications:', err);
//         setLoading(false);
//       }
//     );
//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     if (!uid) {
//       setReadIds(new Set());
//       return;
//     }
//     const unsub = onSnapshot(
//       collection(db, 'users', uid, 'readNotifications'),
//       (snap) => setReadIds(new Set(snap.docs.map((d) => d.id))),
//       (err) => console.error('Failed to load read state:', err)
//     );
//     return () => unsub();
//   }, [uid]);

//   const notifications = useMemo(
//     () =>
//       rawNotifications.map((n) => ({
//         ...n,
//         isRead: readIds.has(n.id),
//         isFavorite: !!localState[n.id]?.isFavorite,
//         isArchived: !!localState[n.id]?.isArchived,
//       })),
//     [rawNotifications, localState, readIds]
//   );

//   const selected = notifications.find((n) => n.id === selectedId) || null;

//   // Opening a notification IS how it gets marked read — no separate button.
//   const handleSelect = async (item) => {
//     setSelectedId(item.id);
//     if (!uid || readIds.has(item.id)) return;
//     try {
//       await setDoc(doc(db, 'users', uid, 'readNotifications', item.id), {
//         readAt: serverTimestamp(),
//       });
//     } catch (err) {
//       console.error('Failed to mark notification as read:', err);
//     }
//   };

//   const handleToggleFavorite = (id) =>
//     setLocalState((prev) => ({
//       ...prev,
//       [id]: { ...prev[id], isFavorite: !prev[id]?.isFavorite },
//     }));
//   const handleArchive = (id) =>
//     setLocalState((prev) => ({
//       ...prev,
//       [id]: { ...prev[id], isArchived: !prev[id]?.isArchived },
//     }));

//   return (
//     <AnimatePresence mode="wait">
//       {selected ? (
//         <NotificationDetail
//           key="detail"
//           item={selected}
//           onBack={() => setSelectedId(null)}
//           onArchive={handleArchive}
//         />
//       ) : (
//         <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//           <NotificationsList
//             notifications={notifications}
//             loading={loading}
//             onSelect={handleSelect}
//             onToggleFavorite={handleToggleFavorite}
//           />
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default NotificationsPage;








import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowLeft,
  MoreVertical,
  AlertTriangle,
  Megaphone,
  HeartHandshake,
  GraduationCap,
  Calendar,
  Bell,
  CheckCircle2,
  Archive,
  Share2,
  Star,
  AlertCircle,
  Loader2,
  Inbox,
} from 'lucide-react';

// ---------------------------------------------------------------------
// Firebase — same `db`/`auth` exports used across the app.
// ---------------------------------------------------------------------
import { db, auth } from '../../firebase/config';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useTheme } from '../../Context/ThemeContext';
/* ------------------------------------------------------------------ */
/*  Category → icon/color lookup                                       */
/*  Firestore only stores the `category` string (e.g. "alert"), so      */
/*  this maps it back to the icon + colors for display. Keep this in   */
/*  sync with the CATEGORIES list in the admin composer.                */
/*  These stay the same vivid accent colors in every theme — they're   */
/*  small identifying chips, not body content.                          */
/* ------------------------------------------------------------------ */

const CATEGORY_META = {
  alert:       { icon: AlertTriangle,  accentBg: 'bg-rose-50',    accentFg: 'text-rose-600',    barColor: 'bg-rose-400' },
  update:      { icon: Megaphone,      accentBg: 'bg-sky-50',     accentFg: 'text-sky-600',     barColor: 'bg-sky-400' },
  prayer:      { icon: HeartHandshake, accentBg: 'bg-amber-50',   accentFg: 'text-amber-600',   barColor: 'bg-amber-400' },
  celebration: { icon: GraduationCap,  accentBg: 'bg-violet-50',  accentFg: 'text-violet-600',  barColor: 'bg-violet-400' },
  event:       { icon: Calendar,       accentBg: 'bg-orange-50',  accentFg: 'text-orange-600',  barColor: 'bg-orange-400' },
  general:     { icon: Bell,           accentBg: 'bg-slate-100',  accentFg: 'text-slate-600',   barColor: 'bg-slate-300' },
};

const categoryMeta = (category) => CATEGORY_META[category] || CATEGORY_META.general;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toDate(value) {
  if (!value) return new Date();
  return value.toDate ? value.toDate() : new Date(value);
}

function timeAgo(date) {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fullTimeAgo(date) {
  const diffMs = Date.now() - date.getTime();
  const diffHr = Math.floor(diffMs / 3600000);
  if (diffHr < 1) return 'Just now';
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
}

function groupLabel(date) {
  const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = startOf(new Date());
  const target = startOf(date);
  const diffDays = Math.round((today - target) / 86400000);
  if (diffDays === 0) return 'TODAY';
  if (diffDays === 1) return 'YESTERDAY';
  if (diffDays <= 7) return 'EARLIER THIS WEEK';
  return 'EARLIER';
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

/* Renders body text, turning **bold** segments into <strong> */
function RichBody({ text }) {
  const { theme, fontSize } = useTheme();
  const paragraphs = text.split('\n\n');
  return (
    <>
      {paragraphs.map((para, pi) => {
        const parts = para.split(/(\*\*.*?\*\*)/g).filter(Boolean);
        return (
          <p key={pi} className={`mb-4 ${fontSize.bodyClass} leading-relaxed ${theme.text} last:mb-0`}>
            {parts.map((part, i) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={i} className={`font-bold ${theme.heading}`}>
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <React.Fragment key={i}>{part}</React.Fragment>
              )
            )}
          </p>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  List row                                                            */
/* ------------------------------------------------------------------ */

function NotificationRow({ item, index, onSelect, onToggleFavorite }) {
  const { theme, fontSize } = useTheme();
  const { icon: Icon, accentBg, accentFg, barColor } = categoryMeta(item.category);
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      onClick={() => onSelect(item)}
      className={`group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border p-3.5 pl-4 text-left shadow-sm transition-shadow hover:shadow-md active:scale-[0.99] ${theme.border} ${theme.cardBg}`}
    >
      <span className={`absolute left-0 top-0 h-full w-1 ${barColor}`} />

      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentBg} ${accentFg}`}>
        <Icon size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`text-[14px] leading-snug ${item.isRead ? 'font-semibold' : 'font-bold'} ${theme.text}`}>
            {item.title}
          </h3>
          <div className="flex shrink-0 items-center gap-1 pt-0.5">
            {!item.isRead && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
            <span className={`text-[10px] font-medium ${theme.subText}`}>{timeAgo(item.createdAt)}</span>
          </div>
        </div>
        <p className={`mt-1 line-clamp-2 ${fontSize.bodyClass} leading-relaxed ${theme.subText}`}>{item.body}</p>
        {item.highPriority && (
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-rose-50 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-rose-600">
            <AlertCircle size={9} /> High Priority
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(item.id);
        }}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-slate-300 opacity-0 transition-opacity hover:text-amber-500 group-hover:opacity-100"
      >
        <Star size={13} fill={item.isFavorite ? 'currentColor' : 'none'} className={item.isFavorite ? 'text-amber-500 opacity-100' : ''} />
      </button>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  List screen                                                         */
/* ------------------------------------------------------------------ */

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'favorite', label: 'Favorite' },
  { key: 'archived', label: 'Archived' },
];

function NotificationsList({ notifications, loading, onSelect, onToggleFavorite }) {
  const { theme } = useTheme();
  const [tab, setTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const unreadTotal = useMemo(
    () => notifications.filter((n) => !n.isRead && !n.isArchived).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    let list = notifications;
    if (tab === 'favorite') list = list.filter((n) => n.isFavorite && !n.isArchived);
    else if (tab === 'archived') list = list.filter((n) => n.isArchived);
    else list = list.filter((n) => !n.isArchived);

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (n) => n.title.toLowerCase().includes(term) || n.body.toLowerCase().includes(term)
      );
    }
    return list;
  }, [notifications, tab, searchTerm]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((n) => {
      const label = groupLabel(n.createdAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    });
    const order = ['TODAY', 'YESTERDAY', 'EARLIER THIS WEEK', 'EARLIER'];
    return order.filter((label) => groups[label]?.length).map((label) => [label, groups[label]]);
  }, [filtered]);

  return (
    <div className={`min-h-screen pb-10 transition-colors ${theme.pageBg}`}>
      <div className="mx-auto max-w-md px-5 pt-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between">
            <h1 className={`text-[22px] font-bold ${theme.heading}`}>Notifications</h1>
            {unreadTotal > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {unreadTotal} unread
              </span>
            )}
          </div>
          <p className={`mt-1 text-[13px] ${theme.subText}`}>
            Stay informed with important church updates and announcements.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="relative mt-4"
        >
          <Search size={15} className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.subText}`} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notices..."
            className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-[13px] outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${theme.border} ${theme.cardBg} ${theme.text}`}
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-4 flex gap-2"
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-colors ${
                tab === t.key ? 'text-white' : `${theme.cardBg} ${theme.subText} border ${theme.border}`
              }`}
            >
              {tab === t.key && (
                <motion.span
                  layoutId="notif-tab-pill"
                  className={`absolute inset-0 rounded-full ${theme.pillBg}`}
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </motion.div>

        {/* List */}
        <div className="mt-5 space-y-5">
          {loading ? (
            <div className="flex flex-col items-center py-16">
              <Loader2 size={20} className={`animate-spin ${theme.verseNum}`} />
              <p className={`mt-3 text-[12px] ${theme.subText}`}>Loading notifications…</p>
            </div>
          ) : grouped.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <Inbox size={18} className={theme.subText} />
              <p className={`text-[13px] ${theme.subText}`}>Nothing here yet.</p>
            </div>
          ) : (
            grouped.map(([label, items]) => (
              <div key={label}>
                <p className={`mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] ${theme.subText}`}>
                  {label}
                </p>
                <div className="space-y-2.5">
                  {items.map((item, i) => (
                    <NotificationRow
                      key={item.id}
                      item={item}
                      index={i}
                      onSelect={onSelect}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail screen                                                       */
/* ------------------------------------------------------------------ */

function NotificationDetail({ item, onBack, onArchive }) {
  const { theme } = useTheme();
  const { icon: Icon, accentBg, accentFg } = categoryMeta(item.category);
  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25 }}
      className={`min-h-screen transition-colors ${theme.pageBg}`}
    >
      {/* Top bar */}
      <div className={`sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3.5 backdrop-blur-sm ${theme.border} ${theme.toolbarBg}`}>
        <button
          onClick={onBack}
          className={`flex h-8 w-8 items-center justify-center rounded-full ${theme.verseNum} hover:opacity-80`}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className={`text-[15px] font-bold ${theme.verseNum}`}>Notification</h1>
        <button className={`flex h-8 w-8 items-center justify-center rounded-full ${theme.subText} hover:opacity-80`}>
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="mx-auto max-w-md px-5 pb-10 pt-5">
        {/* Hero card */}
        <div className={`rounded-2xl border p-5 shadow-sm ${theme.border} ${theme.cardBg}`}>
          <div className="flex items-start gap-3">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accentBg} ${accentFg}`}>
              <Icon size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                {item.badgeLabel && (
                  <span className="rounded-md bg-teal-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {item.badgeLabel}
                  </span>
                )}
                {item.highPriority && (
                  <span className="flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600">
                    <AlertCircle size={10} /> High Priority
                  </span>
                )}
                <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                  <CheckCircle2 size={10} /> Read
                </span>
              </div>
              <h2 className={`text-[19px] font-bold leading-snug ${theme.text}`}>{item.title}</h2>
              <p className={`mt-1 text-[11.5px] font-medium ${theme.subText}`}>{fullTimeAgo(item.createdAt)}</p>
            </div>
          </div>

          <div className={`my-4 h-px ${theme.border}`} />

          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${accentBg} ${accentFg} text-[12px] font-bold`}>
              {initials(item.sender?.name)}
            </span>
            <div className="min-w-0">
              <p className={`truncate text-[13px] font-bold ${theme.text}`}>{item.sender?.name}</p>
              <p className={`truncate text-[11px] ${theme.subText}`}>{item.sender?.role}</p>
            </div>
          </div>
        </div>

        {/* Body card */}
        <div className={`mt-4 rounded-2xl border p-5 shadow-sm ${theme.border} ${theme.cardBg}`}>
          <RichBody text={item.body} />
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2.5">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onArchive(item.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border py-3 text-[13px] font-semibold transition-colors hover:opacity-80 ${theme.border} ${theme.cardBg} ${theme.text}`}
          >
            <Archive size={14} /> {item.isArchived ? 'Unarchive' : 'Archive'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border py-3 text-[13px] font-semibold transition-colors hover:opacity-80 ${theme.border} ${theme.cardBg} ${theme.text}`}
          >
            <Share2 size={14} /> Share
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

const NotificationsPage = () => {
  const [uid, setUid] = useState(null);
  const [rawNotifications, setRawNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // Read state is persisted per-user in Firestore at
  // users/{uid}/readNotifications/{notificationId} so it (a) survives across
  // devices/sessions and (b) can be read by other parts of the app — like the
  // unread badge in DashboardLayout's sidebar — via the same collection.
  const [readIds, setReadIds] = useState(new Set());

  // Favorite/Archive stay device-local for now since they're just personal
  // organizing tools, not something that needs to sync or be counted elsewhere.
  const [localState, setLocalState] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user ? user.uid : null));
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'notifications'),
      where('status', '==', 'PUBLISHED'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setRawNotifications(
          snap.docs.map((d) => {
            const data = d.data();
            return { id: d.id, ...data, createdAt: toDate(data.createdAt) };
          })
        );
        setLoading(false);
      },
      (err) => {
        console.error('Failed to load notifications:', err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!uid) {
      setReadIds(new Set());
      return;
    }
    const unsub = onSnapshot(
      collection(db, 'users', uid, 'readNotifications'),
      (snap) => setReadIds(new Set(snap.docs.map((d) => d.id))),
      (err) => console.error('Failed to load read state:', err)
    );
    return () => unsub();
  }, [uid]);

  const notifications = useMemo(
    () =>
      rawNotifications.map((n) => ({
        ...n,
        isRead: readIds.has(n.id),
        isFavorite: !!localState[n.id]?.isFavorite,
        isArchived: !!localState[n.id]?.isArchived,
      })),
    [rawNotifications, localState, readIds]
  );

  const selected = notifications.find((n) => n.id === selectedId) || null;

  // Opening a notification IS how it gets marked read — no separate button.
  const handleSelect = async (item) => {
    setSelectedId(item.id);
    if (!uid || readIds.has(item.id)) return;
    try {
      await setDoc(doc(db, 'users', uid, 'readNotifications', item.id), {
        readAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleToggleFavorite = (id) =>
    setLocalState((prev) => ({
      ...prev,
      [id]: { ...prev[id], isFavorite: !prev[id]?.isFavorite },
    }));
  const handleArchive = (id) =>
    setLocalState((prev) => ({
      ...prev,
      [id]: { ...prev[id], isArchived: !prev[id]?.isArchived },
    }));

  return (
    <AnimatePresence mode="wait">
      {selected ? (
        <NotificationDetail
          key="detail"
          item={selected}
          onBack={() => setSelectedId(null)}
          onArchive={handleArchive}
        />
      ) : (
        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <NotificationsList
            notifications={notifications}
            loading={loading}
            onSelect={handleSelect}
            onToggleFavorite={handleToggleFavorite}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPage;
