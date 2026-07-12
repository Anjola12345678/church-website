// import React, { useEffect, useMemo, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ArrowLeft,
//   ArrowUpRight,
//   ChevronRight,
//   Clock,
//   Calendar,
//   User,
//   BookOpen,
//   Check,
//   Loader2,
//   Inbox,
//   Sparkles,
// } from 'lucide-react';

// // ---------------------------------------------------------------------
// // Firebase — same `db` export used on the admin side.
// // ---------------------------------------------------------------------
// import { db } from '../../firebase/config';
// import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
// import { useTheme } from '../../Context/ThemeContext';
// /* ------------------------------------------------------------------ */
// /*  Helpers                                                            */
// /* ------------------------------------------------------------------ */

// const HEADER_HEIGHT = 20; // px — simple header + tab bar, used to offset scroll content

// function formatDate(dateStr) {
//   if (!dateStr) return '';
//   const d = new Date(`${dateStr}T00:00:00`);
//   if (Number.isNaN(d.getTime())) return dateStr;
//   return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
// }

// function timeAgo(timestamp) {
//   if (!timestamp) return '';
//   const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//   const diffMs = Date.now() - date.getTime();
//   const diffMin = Math.floor(diffMs / 60000);
//   if (diffMin < 1) return 'Just now';
//   if (diffMin < 60) return `${diffMin}m ago`;
//   const diffHr = Math.floor(diffMin / 60);
//   if (diffHr < 24) return `${diffHr}h ago`;
//   const diffDay = Math.floor(diffHr / 24);
//   if (diffDay < 7) return `${diffDay}d ago`;
//   const diffWeek = Math.floor(diffDay / 7);
//   if (diffWeek < 5) return `${diffWeek}w ago`;
//   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
// }

// function initials(name = '') {
//   return name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
// }

// function Divider() {
//   return <div className="my-5 h-px bg-slate-100" />;
// }

// function SectionTitle({ children }) {
//   return (
//     <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
//       {children}
//     </p>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Fixed page header + tab toggle                                     */
// /* ------------------------------------------------------------------ */

// function ListHeader({ tab, setTab }) {
//   return (
//     <div className="sticky top-0 z-30 border-b border-slate-200 bg-white ">
//       <div className="mx-auto max-w-md px-4 pb-2 pt-2 ">
//         <h1 className="text-[26px] font-bold text-slate-900">Sermons</h1>
//         <p className="mt-0.5 text-[12px] text-slate-500">
//           Messages from the pulpit, ready whenever you are.
//         </p>
//       </div>
//       <div className="mx-auto flex max-w-md border-t border-slate-100 px-4">
//         {[
//           { key: 'current', label: 'Current Sermons' },
//           { key: 'past', label: 'Past Sermons' },
//         ].map((t) => (
//           <button
//             key={t.key}
//             onClick={() => setTab(t.key)}
//             className={`relative flex-1 py-3 text-[13px] font-semibold transition-colors ${
//               tab === t.key ? 'text-teal-700' : 'text-slate-400'
//             }`}
//           >
//             {t.label}
//             {tab === t.key && (
//               <motion.span
//                 layoutId="sermon-list-tab"
//                 className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-700"
//                 transition={{ type: 'spring', stiffness: 500, damping: 40 }}
//               />
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Row used inside "Recent Teachings" and the "Past Sermons" tab      */
// /* ------------------------------------------------------------------ */

// function SermonRow({ sermon, onSelect, index }) {
//   return (
//     <motion.button
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.05 }}
//       onClick={() => onSelect(sermon)}
//       className="flex w-full items-start gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm active:scale-[0.99]"
//     >
//       <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
//         <img src={sermon.image} alt={sermon.title} className="h-full w-full object-cover" />
//         <div className="absolute bottom-1 left-1 flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 backdrop-blur-sm">
//           <BookOpen size={9} className="text-white" />
//           <span className="text-[8px] font-bold uppercase tracking-wide text-white">Read</span>
//         </div>
//       </div>
//       <div className="min-w-0 flex-1">
//         <div className="flex items-start justify-between gap-1">
//           <h3 className="text-[14px] font-bold leading-snug text-slate-900">{sermon.title}</h3>
//           <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-slate-300" />
//         </div>
//         <p className="mt-0.5 text-[11px] font-semibold text-teal-700">{sermon.preacher}</p>
//         <p className="text-[11px] text-slate-400">{formatDate(sermon.date)}</p>
//         {sermon.introduction && (
//           <p className="mt-1 truncate text-[12px] text-slate-500">
//             {sermon.introduction.substring(0, 50)}…
//           </p>
//         )}
//         <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">
//           <span className="flex items-center gap-1">
//             <Calendar size={10} /> {sermon.serviceType}
//           </span>
//           <span className="flex items-center gap-1">
//             <Clock size={10} /> {timeAgo(sermon.createdAt)}
//           </span>
//         </div>
//       </div>
//     </motion.button>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Detail screen                                                      */
// /* ------------------------------------------------------------------ */

// function SermonDetail({ sermon, onBack }) {
//   const [checked, setChecked] = useState(() => (sermon.keyLessons || []).map(() => false));

//   const toggleCheck = (i) =>
//     setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

//   return (
//     <motion.div
//       key="detail"
//       initial={{ opacity: 0, x: 40 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 40 }}
//       transition={{ duration: 0.25 }}
//       className="min-h-screen bg-white pb-16"
//     >
//       {/* Fixed back button — stays put no matter how far the page scrolls */}
//       <motion.button
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         whileTap={{ scale: 0.92 }}
//         onClick={onBack}
//         className="fixed left-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white shadow-lg backdrop-blur-md"
//       >
//         <ArrowLeft size={16} />
//       </motion.button>

//       {/* ── Hero header ── */}
//       <div className="relative overflow-hidden px-4 pb-6 pt-16 text-white">
//         <img
//           src={sermon.image}
//           alt=""
//           className="absolute inset-0 h-full w-full object-cover"
//         />
//         <div
//           className="absolute inset-0"
//           style={{ background: 'linear-gradient(180deg, rgba(11,44,42,0.55) 0%, rgba(11,44,42,0.88) 100%)' }}
//         />

//         <div className="relative">
//           <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300">
//             {sermon.serviceType} &nbsp;·&nbsp; {formatDate(sermon.date)}
//           </p>
//           <h1 className="text-[24px] font-bold leading-tight">{sermon.title}</h1>

//           <div className="mt-3 flex items-center gap-2.5">
//             <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
//               {initials(sermon.preacher)}
//             </span>
//             <span className="text-[13px] font-semibold text-teal-100">{sermon.preacher}</span>
//             <span className="flex items-center gap-1 text-[11px] text-teal-200/80">
//               <Clock size={10} /> {timeAgo(sermon.createdAt)}
//             </span>
//           </div>

//           {sermon.mainScripture && (
//             <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
//               <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-teal-300">
//                 Main Scripture
//               </p>
//               <p className="mt-1 text-[14px] font-semibold text-white/90">{sermon.mainScripture}</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Scrollable body ── */}
//       <div className="mx-auto max-w-md divide-y divide-slate-100 px-4">

//         {sermon.memoryVerse && (
//           <div className="py-5">
//             <SectionTitle>Memory Verse</SectionTitle>
//             <p className="text-[14px] italic leading-relaxed text-slate-600">{sermon.memoryVerse}</p>
//           </div>
//         )}

//         {sermon.introduction && (
//           <div className="py-5">
//             <SectionTitle>Introduction</SectionTitle>
//             <p className="whitespace-pre-line text-[14px] leading-relaxed text-slate-600">
//               {sermon.introduction}
//             </p>
//           </div>
//         )}

//         {sermon.mainPoints?.length > 0 && (
//           <div className="py-5">
//             <SectionTitle>Teaching Points</SectionTitle>
//             <div className="space-y-6">
//               {sermon.mainPoints.map((pt, i) => (
//                 <div key={i}>
//                   <div className="mb-2 flex items-start gap-3">
//                     <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-teal-700 text-[12px] font-bold text-teal-700">
//                       {String(i + 1).padStart(2, '0')}
//                     </span>
//                     <div>
//                       <h3 className="text-[16px] font-bold text-slate-900">{pt.title}</h3>
//                       {pt.scripture && (
//                         <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-teal-600">
//                           <BookOpen size={11} /> {pt.scripture}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {pt.explanation && (
//                     <p className="mb-3 pl-11 text-[14px] leading-relaxed text-slate-600">{pt.explanation}</p>
//                   )}

//                   {pt.illustration && (
//                     <div className="ml-11 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
//                       <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
//                         Illustration
//                       </p>
//                       <p className="text-[13px] italic leading-relaxed text-slate-500">{pt.illustration}</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {sermon.relatedScriptures?.length > 0 && (
//           <div className="py-5">
//             <SectionTitle>Related Scriptures</SectionTitle>
//             <div className="flex flex-wrap gap-2">
//               {sermon.relatedScriptures.map((ref) => (
//                 <span
//                   key={ref}
//                   className="rounded-full bg-teal-50 px-3 py-1.5 text-[12px] font-medium text-teal-700"
//                 >
//                   {ref}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         {sermon.keyLessons?.length > 0 && (
//           <div className="py-5">
//             <SectionTitle>Key Lessons</SectionTitle>
//             <div className="space-y-3">
//               {sermon.keyLessons.map((item, i) => (
//                 <button
//                   key={i}
//                   onClick={() => toggleCheck(i)}
//                   className="flex w-full items-start gap-3 text-left"
//                 >
//                   <span
//                     className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
//                       checked[i] ? 'border-teal-600 bg-teal-600' : 'border-slate-300 bg-white'
//                     }`}
//                   >
//                     {checked[i] && <Check size={11} className="text-white" strokeWidth={3} />}
//                   </span>
//                   <span
//                     className={`text-[14px] leading-relaxed transition-colors ${
//                       checked[i] ? 'text-slate-400 line-through' : 'text-slate-700'
//                     }`}
//                   >
//                     {item}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {sermon.conclusion && (
//           <div className="py-5">
//             <SectionTitle>Conclusion</SectionTitle>
//             <div
//               className="rounded-2xl p-5 text-white"
//               style={{ background: 'linear-gradient(135deg, #0F3B39 0%, #0B2C2A 100%)' }}
//             >
//               <p className="whitespace-pre-line text-[14px] italic leading-relaxed text-teal-50">
//                 {sermon.conclusion}
//               </p>
//             </div>
//           </div>
//         )}

//         {sermon.prayerPoints?.length > 0 && (
//           <div className="pb-8 pt-5">
//             <SectionTitle>Prayer Points</SectionTitle>
//             <div className="space-y-3">
//               {sermon.prayerPoints.map((text, i) => (
//                 <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
//                   <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-teal-700">
//                     Prayer Point {i + 1}
//                   </p>
//                   <p className="text-[13px] leading-relaxed text-slate-600">{text}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  List screen                                                        */
// /* ------------------------------------------------------------------ */

// const CURRENT_WINDOW_DAYS = 30;

// function EmptyState({ label }) {
//   return (
//     <div className="flex flex-col items-center py-16 text-center">
//       <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
//         <Inbox size={18} />
//       </div>
//       <p className="text-[13px] text-slate-400">{label}</p>
//     </div>
//   );
// }

// function SermonList({ sermons, loading, onSelect }) {
//   const [tab, setTab] = useState('current');

//   // const { currentSermons, pastSermons } = useMemo(() => {
//   //   const cutoff = Date.now() - CURRENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
//   //   const current = [];
//   //   const past = [];
//   //   sermons.forEach((s) => {
//   //     const d = new Date(`${s.date}T00:00:00`).getTime();
//   //     if (!Number.isNaN(d) && d < cutoff) past.push(s);
//   //     else current.push(s);
//   //   });
//   //   return { currentSermons: current, pastSermons: past };
//   // }, [sermons]);

//   const { currentSermons, pastSermons } = useMemo(() => {
//   const current = [];
//   const past = [];
  
//   // Get today's date at midnight for accurate comparison
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   sermons.forEach((s) => {
//     // Parse the sermon date
//     const sermonDate = new Date(`${s.date}T00:00:00`);
    
//     // Add 1 day (grace period) to the sermon date
//     const expiryDate = new Date(sermonDate);
//     expiryDate.setDate(expiryDate.getDate() + 1);

//     // If today is after the grace period, it's a past sermon
//     if (today > expiryDate) {
//       past.push(s);
//     } else {
//       current.push(s);
//     }
//   });
  
//   return { currentSermons: current, pastSermons: past };
// }, [sermons]);

//   const featured = currentSermons[0];
//   const recent = currentSermons.slice(1);

//   return (
//     <div className="min-h-screen bg-slate-50 ">
//       <ListHeader tab={tab} setTab={setTab} />

//       <div className="w-full" style={{ paddingTop: HEADER_HEIGHT }}>
//         {loading ? (
//           <div className="flex flex-col items-center py-20">
//             <Loader2 size={20} className="animate-spin text-teal-700" />
//             <p className="mt-3 text-[12px] text-slate-400">Loading sermons…</p>
//           </div>
//         ) : (
//           <AnimatePresence mode="wait">
//             {tab === 'current' ? (
//               <motion.div
//                 key="current"
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -8 }}
//                 transition={{ duration: 0.2 }}
//                 className="pb-8 pt-4 p-4"
//               >
//                 {!featured ? (
//                   <EmptyState label="No sermons posted yet — check back soon." />
//                 ) : (
//                   <>
//                     {/* Featured */}
//                     <button
//                       onClick={() => onSelect(featured)}
//                       className="group relative mb-6 h-52 w-full overflow-hidden rounded-2xl text-left shadow-md"
//                     >
//                       <img
//                         src={featured.image}
//                         alt={featured.title}
//                         className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
//                       <div className="absolute inset-0 flex flex-col justify-between p-4">
//                         <span className="flex items-center gap-1 self-start rounded-md bg-teal-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
//                           <Sparkles size={10} /> Latest Message
//                         </span>
//                         <div>
//                           <h2 className="text-[22px] font-bold leading-tight text-white">{featured.title}</h2>
//                           <div className="mt-2 flex items-center gap-3 text-[11px] text-white/80">
//                             <span className="flex items-center gap-1"><User size={10} /> {featured.preacher}</span>
//                             <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(featured.createdAt)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </button>

//                     {recent.length > 0 && (
//                       <>
//                         <div className="mb-3 flex items-center justify-between">
//                           <h2 className="text-[17px] font-bold text-slate-900">Recent Teachings</h2>
//                           <span className="flex items-center gap-0.5 text-[12px] font-semibold text-teal-700">
//                             {recent.length} more <ChevronRight size={14} />
//                           </span>
//                         </div>
//                         <div className="space-y-3">
//                           {recent.map((sermon, i) => (
//                             <SermonRow key={sermon.id} sermon={sermon} onSelect={onSelect} index={i} />
//                           ))}
//                         </div>
//                       </>
//                     )}
//                   </>
//                 )}
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="past"
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -8 }}
//                 transition={{ duration: 0.2 }}
//                 className="space-y-3 pb-8 pt-4 z-20"
//               >
//                 {pastSermons.length === 0 ? (
//                   <EmptyState label="No past sermons archived yet." />
//                 ) : (
//                   pastSermons.map((sermon, i) => (
//                     <SermonRow key={sermon.id} sermon={sermon} onSelect={onSelect} index={i} />
//                   ))
//                 )}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Root                                                               */
// /* ------------------------------------------------------------------ */

// const SermonPage = () => {
//   const [sermons, setSermons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState(null);

//   useEffect(() => {
//     const q = query(
//       collection(db, 'sermon'),
//       where('status', '==', 'PUBLISHED'),
//       orderBy('createdAt', 'desc')
//     );
//     const unsubscribe = onSnapshot(
//       q,
//       (snap) => {
//         setSermons(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//         setLoading(false);
//       },
//       (err) => {
//         console.error('Failed to load sermons:', err);
//         setLoading(false);
//       }
//     );
//     return unsubscribe;
//   }, []);

//   return (
//     <AnimatePresence mode="wait">
//       {selected ? (
//         <SermonDetail key="detail" sermon={selected} onBack={() => setSelected(null)} />
//       ) : (
//         <SermonList key="list" sermons={sermons} loading={loading} onSelect={setSelected} />
//       )}
//     </AnimatePresence>
//   );
// };

// export default SermonPage;








import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Calendar,
  User,
  BookOpen,
  Check,
  Loader2,
  Inbox,
  Sparkles,
} from 'lucide-react';

// ---------------------------------------------------------------------
// Firebase — same `db` export used on the admin side.
// ---------------------------------------------------------------------
import { db } from '../../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useTheme } from '../../Context/ThemeContext';
/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const HEADER_HEIGHT = 20; // px — simple header + tab bar, used to offset scroll content

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

// Small helper for the couple of teal "chip" accents used in the detail
// view (related scriptures) — kept legible on dark backgrounds too.
function chipClasses(themeKey) {
  return themeKey === 'dark' ? 'bg-teal-900/40 text-teal-300' : 'bg-teal-50 text-teal-700';
}

function Divider() {
  const { themeKey } = useTheme();
  return <div className={`my-5 h-px ${themeKey === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`} />;
}

function SectionTitle({ children }) {
  const { theme } = useTheme();
  return (
    <p className={`mb-3 text-[11px] font-bold uppercase tracking-[0.12em] ${theme.subText}`}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Fixed page header + tab toggle                                     */
/* ------------------------------------------------------------------ */

function ListHeader({ tab, setTab }) {
  const { theme } = useTheme();
  return (
    <div className={`sticky top-0 z-30 border-b transition-colors ${theme.border} ${theme.cardBg}`}>
      <div className="mx-auto max-w-md px-4 pb-2 pt-2 ">
        <h1 className={`text-[26px] font-bold ${theme.heading}`}>Sermons</h1>
        <p className={`mt-0.5 text-[12px] ${theme.subText}`}>
          Messages from the pulpit, ready whenever you are.
        </p>
      </div>
      <div className={`mx-auto flex max-w-md border-t px-4 ${theme.border}`}>
        {[
          { key: 'current', label: 'Current Sermons' },
          { key: 'past', label: 'Past Sermons' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative flex-1 py-3 text-[13px] font-semibold transition-colors ${
              tab === t.key ? theme.verseNum : theme.subText
            }`}
          >
            {t.label}
            {tab === t.key && (
              <motion.span
                layoutId="sermon-list-tab"
                className={`absolute bottom-0 left-0 right-0 h-[2px] ${theme.pillBg}`}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Row used inside "Recent Teachings" and the "Past Sermons" tab      */
/* ------------------------------------------------------------------ */

function SermonRow({ sermon, onSelect, index }) {
  const { theme } = useTheme();
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onSelect(sermon)}
      className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left shadow-sm active:scale-[0.99] ${theme.border} ${theme.cardBg}`}
    >
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
        <img src={sermon.image} alt={sermon.title} className="h-full w-full object-cover" />
        <div className="absolute bottom-1 left-1 flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 backdrop-blur-sm">
          <BookOpen size={9} className="text-white" />
          <span className="text-[8px] font-bold uppercase tracking-wide text-white">Read</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <h3 className={`text-[14px] font-bold leading-snug ${theme.text}`}>{sermon.title}</h3>
          <ArrowUpRight size={14} className={`mt-0.5 shrink-0 ${theme.subText}`} />
        </div>
        <p className={`mt-0.5 text-[11px] font-semibold ${theme.verseNum}`}>{sermon.preacher}</p>
        <p className={`text-[11px] ${theme.subText}`}>{formatDate(sermon.date)}</p>
        {sermon.introduction && (
          <p className={`mt-1 truncate text-[12px] ${theme.subText}`}>
            {sermon.introduction.substring(0, 50)}…
          </p>
        )}
        <div className={`mt-1.5 flex items-center gap-3 text-[11px] ${theme.subText}`}>
          <span className="flex items-center gap-1">
            <Calendar size={10} /> {sermon.serviceType}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} /> {timeAgo(sermon.createdAt)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail screen                                                      */
/* ------------------------------------------------------------------ */

function SermonDetail({ sermon, onBack }) {
  const { theme, themeKey, fontSize } = useTheme();
  const [checked, setChecked] = useState(() => (sermon.keyLessons || []).map(() => false));

  const toggleCheck = (i) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25 }}
      className={`min-h-screen pb-16 transition-colors ${theme.pageBg}`}
    >
      {/* Fixed back button — stays put no matter how far the page scrolls */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.92 }}
        onClick={onBack}
        className="fixed left-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white shadow-lg backdrop-blur-md"
      >
        <ArrowLeft size={16} />
      </motion.button>

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden px-4 pb-6 pt-16 text-white">
        <img
          src={sermon.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(11,44,42,0.55) 0%, rgba(11,44,42,0.88) 100%)' }}
        />

        <div className="relative">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300">
            {sermon.serviceType} &nbsp;·&nbsp; {formatDate(sermon.date)}
          </p>
          <h1 className="text-[24px] font-bold leading-tight">{sermon.title}</h1>

          <div className="mt-3 flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
              {initials(sermon.preacher)}
            </span>
            <span className="text-[13px] font-semibold text-teal-100">{sermon.preacher}</span>
            <span className="flex items-center gap-1 text-[11px] text-teal-200/80">
              <Clock size={10} /> {timeAgo(sermon.createdAt)}
            </span>
          </div>

          {sermon.mainScripture && (
            <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-teal-300">
                Main Scripture
              </p>
              <p className="mt-1 text-[14px] font-semibold text-white/90">{sermon.mainScripture}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className={`mx-auto max-w-md divide-y px-4 ${themeKey === 'dark' ? 'divide-slate-800' : 'divide-slate-100'}`}>

        {sermon.memoryVerse && (
          <div className="py-5">
            <SectionTitle>Memory Verse</SectionTitle>
            <p className={`${fontSize.bodyClass} italic leading-relaxed ${theme.text}`}>{sermon.memoryVerse}</p>
          </div>
        )}

        {sermon.introduction && (
          <div className="py-5">
            <SectionTitle>Introduction</SectionTitle>
            <p className={`whitespace-pre-line ${fontSize.bodyClass} leading-relaxed ${theme.text}`}>
              {sermon.introduction}
            </p>
          </div>
        )}

        {sermon.mainPoints?.length > 0 && (
          <div className="py-5">
            <SectionTitle>Teaching Points</SectionTitle>
            <div className="space-y-6">
              {sermon.mainPoints.map((pt, i) => (
                <div key={i}>
                  <div className="mb-2 flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-teal-700 text-[12px] font-bold text-teal-700">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className={`text-[16px] font-bold ${theme.text}`}>{pt.title}</h3>
                      {pt.scripture && (
                        <p className={`mt-0.5 flex items-center gap-1 text-[11px] font-semibold ${theme.verseNum}`}>
                          <BookOpen size={11} /> {pt.scripture}
                        </p>
                      )}
                    </div>
                  </div>

                  {pt.explanation && (
                    <p className={`mb-3 pl-11 ${fontSize.bodyClass} leading-relaxed ${theme.text}`}>{pt.explanation}</p>
                  )}

                  {pt.illustration && (
                    <div className={`ml-11 rounded-xl border px-4 py-3 ${themeKey === 'dark' ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      <p className={`mb-1 text-[9px] font-bold uppercase tracking-[0.1em] ${theme.subText}`}>
                        Illustration
                      </p>
                      <p className={`text-[13px] italic leading-relaxed ${theme.subText}`}>{pt.illustration}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {sermon.relatedScriptures?.length > 0 && (
          <div className="py-5">
            <SectionTitle>Related Scriptures</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {sermon.relatedScriptures.map((ref) => (
                <span
                  key={ref}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${chipClasses(themeKey)}`}
                >
                  {ref}
                </span>
              ))}
            </div>
          </div>
        )}

        {sermon.keyLessons?.length > 0 && (
          <div className="py-5">
            <SectionTitle>Key Lessons</SectionTitle>
            <div className="space-y-3">
              {sermon.keyLessons.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      checked[i] ? 'border-teal-600 bg-teal-600' : `${theme.border} ${theme.cardBg}`
                    }`}
                  >
                    {checked[i] && <Check size={11} className="text-white" strokeWidth={3} />}
                  </span>
                  <span
                    className={`${fontSize.bodyClass} leading-relaxed transition-colors ${
                      checked[i] ? `${theme.subText} line-through` : theme.text
                    }`}
                  >
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {sermon.conclusion && (
          <div className="py-5">
            <SectionTitle>Conclusion</SectionTitle>
            <div
              className="rounded-2xl p-5 text-white"
              style={{ background: 'linear-gradient(135deg, #0F3B39 0%, #0B2C2A 100%)' }}
            >
              <p className={`whitespace-pre-line ${fontSize.bodyClass} italic leading-relaxed text-teal-50`}>
                {sermon.conclusion}
              </p>
            </div>
          </div>
        )}

        {sermon.prayerPoints?.length > 0 && (
          <div className="pb-8 pt-5">
            <SectionTitle>Prayer Points</SectionTitle>
            <div className="space-y-3">
              {sermon.prayerPoints.map((text, i) => (
                <div key={i} className={`rounded-2xl border p-4 ${theme.border} ${theme.cardBg}`}>
                  <p className={`mb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] ${theme.verseNum}`}>
                    Prayer Point {i + 1}
                  </p>
                  <p className={`${fontSize.bodyClass} leading-relaxed ${theme.text}`}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  List screen                                                        */
/* ------------------------------------------------------------------ */

const CURRENT_WINDOW_DAYS = 30;

function EmptyState({ label }) {
  const { theme, themeKey } = useTheme();
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${themeKey === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} ${theme.subText}`}>
        <Inbox size={18} />
      </div>
      <p className={`text-[13px] ${theme.subText}`}>{label}</p>
    </div>
  );
}

function SermonList({ sermons, loading, onSelect }) {
  const { theme } = useTheme();
  const [tab, setTab] = useState('current');

  // const { currentSermons, pastSermons } = useMemo(() => {
  //   const cutoff = Date.now() - CURRENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  //   const current = [];
  //   const past = [];
  //   sermons.forEach((s) => {
  //     const d = new Date(`${s.date}T00:00:00`).getTime();
  //     if (!Number.isNaN(d) && d < cutoff) past.push(s);
  //     else current.push(s);
  //   });
  //   return { currentSermons: current, pastSermons: past };
  // }, [sermons]);

  const { currentSermons, pastSermons } = useMemo(() => {
  const current = [];
  const past = [];
  
  // Get today's date at midnight for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  sermons.forEach((s) => {
    // Parse the sermon date
    const sermonDate = new Date(`${s.date}T00:00:00`);
    
    // Add 1 day (grace period) to the sermon date
    const expiryDate = new Date(sermonDate);
    expiryDate.setDate(expiryDate.getDate() + 1);

    // If today is after the grace period, it's a past sermon
    if (today > expiryDate) {
      past.push(s);
    } else {
      current.push(s);
    }
  });
  
  return { currentSermons: current, pastSermons: past };
}, [sermons]);

  const featured = currentSermons[0];
  const recent = currentSermons.slice(1);

  return (
    <div className={`min-h-screen transition-colors ${theme.pageBg}`}>
      <ListHeader tab={tab} setTab={setTab} />

      <div className="w-full" style={{ paddingTop: HEADER_HEIGHT }}>
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 size={20} className={`animate-spin ${theme.verseNum}`} />
            <p className={`mt-3 text-[12px] ${theme.subText}`}>Loading sermons…</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'current' ? (
              <motion.div
                key="current"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="pb-8 pt-4 p-4"
              >
                {!featured ? (
                  <EmptyState label="No sermons posted yet — check back soon." />
                ) : (
                  <>
                    {/* Featured */}
                    <button
                      onClick={() => onSelect(featured)}
                      className="group relative mb-6 h-52 w-full overflow-hidden rounded-2xl text-left shadow-md"
                    >
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-between p-4">
                        <span className="flex items-center gap-1 self-start rounded-md bg-teal-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                          <Sparkles size={10} /> Latest Message
                        </span>
                        <div>
                          <h2 className="text-[22px] font-bold leading-tight text-white">{featured.title}</h2>
                          <div className="mt-2 flex items-center gap-3 text-[11px] text-white/80">
                            <span className="flex items-center gap-1"><User size={10} /> {featured.preacher}</span>
                            <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(featured.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {recent.length > 0 && (
                      <>
                        <div className="mb-3 flex items-center justify-between">
                          <h2 className={`text-[17px] font-bold ${theme.heading}`}>Recent Teachings</h2>
                          <span className={`flex items-center gap-0.5 text-[12px] font-semibold ${theme.verseNum}`}>
                            {recent.length} more <ChevronRight size={14} />
                          </span>
                        </div>
                        <div className="space-y-3">
                          {recent.map((sermon, i) => (
                            <SermonRow key={sermon.id} sermon={sermon} onSelect={onSelect} index={i} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="past"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 pb-8 pt-4 z-20 px-4"
              >
                {pastSermons.length === 0 ? (
                  <EmptyState label="No past sermons archived yet." />
                ) : (
                  pastSermons.map((sermon, i) => (
                    <SermonRow key={sermon.id} sermon={sermon} onSelect={onSelect} index={i} />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

const SermonPage = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'sermon'),
      where('status', '==', 'PUBLISHED'),
      orderBy('createdAt', 'desc')
    );
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

  return (
    <AnimatePresence mode="wait">
      {selected ? (
        <SermonDetail key="detail" sermon={selected} onBack={() => setSelected(null)} />
      ) : (
        <SermonList key="list" sermons={sermons} loading={loading} onSelect={setSelected} />
      )}
    </AnimatePresence>
  );
};

export default SermonPage;
