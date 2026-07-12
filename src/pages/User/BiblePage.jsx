// import React, { useState, useEffect } from 'react';
// import { FaChevronDown, FaBookOpen } from 'react-icons/fa';

// const books = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"];

// const Bible = () => {
//   const [book, setBook] = useState("Psalms");
//   const [chapter, setChapter] = useState(23);
//   const [verses, setVerses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isBookOpen, setIsBookOpen] = useState(false);
//   const [isChapterOpen, setIsChapterOpen] = useState(false);

//   const loadChapter = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`https://bible-api.com/${encodeURIComponent(`${book} ${chapter}`)}`);
//       const data = await response.json();
//       setVerses(data.verses || []);
//     } catch (error) { console.error(error); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { loadChapter(); }, [book, chapter]);

//   return (
//     // 1. Added h-screen and overflow-hidden to lock the whole page
//     <div className="h-screen bg-neutral-50 py-2 px- md:p-12 flex flex-col items-center overflow-hidden  ">
      
//       {/* 2. Header: Stays fixed because it's outside the scrolling container */}
//       <div className="w-full max-w-3xl mb-8 flex items-center gap-3 text-[#0F3B39] text-center justify-center shrink-0">
//         <FaBookOpen className="text-3xl" />
//         <h1 className="text-3xl font-bold tracking-tight">Scripture Reader</h1>
//       </div>

//       {/* 3. Main Card: Acts as the scroll container */}
//       <div className="w-full max-w-lg md:max-w-4xl bg-white rounded-3xl shadow-lg border border-neutral-200 flex flex-col overflow-hidden h-full">
        
//         {/* Navigation Bar: Sticky inside the card */}
//         <div className="sticky top-0 z-10 border-b border-neutral-100 bg-white">
//             <div className="grid grid-cols-2 gap-3 p-6 bg-neutral-50/50">
//               <div className="relative">
//                 <button onClick={() => { setIsBookOpen(!isBookOpen); setIsChapterOpen(false); }} className="w-full bg-[#0F3B39] text-white px-4 py-3 rounded-xl font-medium flex justify-between items-center">
//                   <span className="mr-2 truncate">{book}</span>
//                   <FaChevronDown className="text-teal-200 text-xs" />
//                 </button>
//                 {isBookOpen && (
//                   <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
//                     {books.map(b => (
//                       <div key={b} onClick={() => { setBook(b); setIsBookOpen(false); }} className="px-5 py-3 text-neutral-700 hover:bg-teal-50 cursor-pointer">{b}</div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div className="relative">
//                 <button onClick={() => { setIsChapterOpen(!isChapterOpen); setIsBookOpen(false); }} className="w-full bg-[#0F3B39] text-white px-4 py-3 rounded-xl font-medium flex justify-between items-center">
//                   <span>Chapter {chapter}</span>
//                   <FaChevronDown className="text-teal-200 text-xs" />
//                 </button>
//                 {isChapterOpen && (
//                   <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
//                     {[...Array(150).keys()].map(i => (
//                       <div key={i+1} onClick={() => { setChapter(i+1); setIsChapterOpen(false); }} className="px-5 py-3 text-neutral-700 hover:bg-teal-50 cursor-pointer">Chapter {i+1}</div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//         </div>

//         {/* 4. Scripture Area: Scrollable independently */}
//         <div className="px-8 py-2  md:p-12 overflow-y-auto">
//           <h2 className="text-4xl font-bold text-[#0F3B39] mb-4">{book} {chapter}</h2>
//           <div className="border-t border-neutral-200 mb-1"></div>
//           {loading ? <div className="text-center"></div> : (
//             <div className="space-y-6">
//               {verses.map((v) => (
//                 <p key={v.verse} className="text-xl md:text-2xl text-neutral-800 leading-relaxed font-serif">
//                   <sup className="text-[#0F3B39] font-bold mr-3 text-lg">{v.verse}</sup>
//                   {v.text}
//                 </p>
//               ))}
//             </div>
//           )}
//           <div className="mt-20 text-center text-neutral-400 text-sm uppercase tracking-widest font-bold border-t border-neutral-200 pt-8">
//              End of Chapter
//            </div>
//         </div>
        
//       </div>
//     </div>
//   );
// };

// export default Bible;












// import React, { useEffect, useMemo, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   BookOpen,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ArrowLeft,
//   Search,
//   SlidersHorizontal,
//   X,
//   Sun,
//   Moon,
//   Coffee,
//   Copy,
//   Check,
//   Highlighter,
//   Loader2,
//   AlertCircle,
//   RotateCcw,
// } from 'lucide-react';

// /* ------------------------------------------------------------------ */
// /*  Bible book data — name, testament, and real chapter counts so the  */
// /*  chapter picker only ever offers chapters that actually exist.       */
// /* ------------------------------------------------------------------ */

// const BOOKS = [
//   // Old Testament
//   { name: 'Genesis', chapters: 50, testament: 'OT' },
//   { name: 'Exodus', chapters: 40, testament: 'OT' },
//   { name: 'Leviticus', chapters: 27, testament: 'OT' },
//   { name: 'Numbers', chapters: 36, testament: 'OT' },
//   { name: 'Deuteronomy', chapters: 34, testament: 'OT' },
//   { name: 'Joshua', chapters: 24, testament: 'OT' },
//   { name: 'Judges', chapters: 21, testament: 'OT' },
//   { name: 'Ruth', chapters: 4, testament: 'OT' },
//   { name: '1 Samuel', chapters: 31, testament: 'OT' },
//   { name: '2 Samuel', chapters: 24, testament: 'OT' },
//   { name: '1 Kings', chapters: 22, testament: 'OT' },
//   { name: '2 Kings', chapters: 25, testament: 'OT' },
//   { name: '1 Chronicles', chapters: 29, testament: 'OT' },
//   { name: '2 Chronicles', chapters: 36, testament: 'OT' },
//   { name: 'Ezra', chapters: 10, testament: 'OT' },
//   { name: 'Nehemiah', chapters: 13, testament: 'OT' },
//   { name: 'Esther', chapters: 10, testament: 'OT' },
//   { name: 'Job', chapters: 42, testament: 'OT' },
//   { name: 'Psalms', chapters: 150, testament: 'OT' },
//   { name: 'Proverbs', chapters: 31, testament: 'OT' },
//   { name: 'Ecclesiastes', chapters: 12, testament: 'OT' },
//   { name: 'Song of Solomon', chapters: 8, testament: 'OT' },
//   { name: 'Isaiah', chapters: 66, testament: 'OT' },
//   { name: 'Jeremiah', chapters: 52, testament: 'OT' },
//   { name: 'Lamentations', chapters: 5, testament: 'OT' },
//   { name: 'Ezekiel', chapters: 48, testament: 'OT' },
//   { name: 'Daniel', chapters: 12, testament: 'OT' },
//   { name: 'Hosea', chapters: 14, testament: 'OT' },
//   { name: 'Joel', chapters: 3, testament: 'OT' },
//   { name: 'Amos', chapters: 9, testament: 'OT' },
//   { name: 'Obadiah', chapters: 1, testament: 'OT' },
//   { name: 'Jonah', chapters: 4, testament: 'OT' },
//   { name: 'Micah', chapters: 7, testament: 'OT' },
//   { name: 'Nahum', chapters: 3, testament: 'OT' },
//   { name: 'Habakkuk', chapters: 3, testament: 'OT' },
//   { name: 'Zephaniah', chapters: 3, testament: 'OT' },
//   { name: 'Haggai', chapters: 2, testament: 'OT' },
//   { name: 'Zechariah', chapters: 14, testament: 'OT' },
//   { name: 'Malachi', chapters: 4, testament: 'OT' },
//   // New Testament
//   { name: 'Matthew', chapters: 28, testament: 'NT' },
//   { name: 'Mark', chapters: 16, testament: 'NT' },
//   { name: 'Luke', chapters: 24, testament: 'NT' },
//   { name: 'John', chapters: 21, testament: 'NT' },
//   { name: 'Acts', chapters: 28, testament: 'NT' },
//   { name: 'Romans', chapters: 16, testament: 'NT' },
//   { name: '1 Corinthians', chapters: 16, testament: 'NT' },
//   { name: '2 Corinthians', chapters: 13, testament: 'NT' },
//   { name: 'Galatians', chapters: 6, testament: 'NT' },
//   { name: 'Ephesians', chapters: 6, testament: 'NT' },
//   { name: 'Philippians', chapters: 4, testament: 'NT' },
//   { name: 'Colossians', chapters: 4, testament: 'NT' },
//   { name: '1 Thessalonians', chapters: 5, testament: 'NT' },
//   { name: '2 Thessalonians', chapters: 3, testament: 'NT' },
//   { name: '1 Timothy', chapters: 6, testament: 'NT' },
//   { name: '2 Timothy', chapters: 4, testament: 'NT' },
//   { name: 'Titus', chapters: 3, testament: 'NT' },
//   { name: 'Philemon', chapters: 1, testament: 'NT' },
//   { name: 'Hebrews', chapters: 13, testament: 'NT' },
//   { name: 'James', chapters: 5, testament: 'NT' },
//   { name: '1 Peter', chapters: 5, testament: 'NT' },
//   { name: '2 Peter', chapters: 3, testament: 'NT' },
//   { name: '1 John', chapters: 5, testament: 'NT' },
//   { name: '2 John', chapters: 1, testament: 'NT' },
//   { name: '3 John', chapters: 1, testament: 'NT' },
//   { name: 'Jude', chapters: 1, testament: 'NT' },
//   { name: 'Revelation', chapters: 22, testament: 'NT' },
// ];

// /* ------------------------------------------------------------------ */
// /*  Reading preferences: font size + theme                             */
// /* ------------------------------------------------------------------ */

// const FONT_SIZES = [
//   { key: 'sm', label: 'S', verseClass: 'text-lg md:text-xl' },
//   { key: 'md', label: 'M', verseClass: 'text-xl md:text-2xl' },
//   { key: 'lg', label: 'L', verseClass: 'text-2xl md:text-3xl' },
//   { key: 'xl', label: 'XL', verseClass: 'text-3xl md:text-4xl' },
// ];

// const THEMES = {
//   light: {
//     label: 'Light',
//     icon: Sun,
//     pageBg: 'bg-neutral-50',
//     cardBg: 'bg-white',
//     toolbarBg: 'bg-neutral-50/80',
//     border: 'border-neutral-200',
//     heading: 'text-[#0F3B39]',
//     text: 'text-neutral-800',
//     subText: 'text-neutral-400',
//     verseNum: 'text-[#0F3B39]',
//     pillBg: 'bg-[#0F3B39]',
//     pillText: 'text-white',
//     iconBtn: 'text-[#0F3B39] border-neutral-200 hover:bg-neutral-100',
//     selectedVerseBg: 'bg-black/[0.04]',
//   },
//   sepia: {
//     label: 'Sepia',
//     icon: Coffee,
//     pageBg: 'bg-[#F1E7D0]',
//     cardBg: 'bg-[#FBF3E3]',
//     toolbarBg: 'bg-[#F1E7D0]/80',
//     border: 'border-[#e3d5b8]',
//     heading: 'text-[#5b4636]',
//     text: 'text-[#5b4636]',
//     subText: 'text-[#a08a68]',
//     verseNum: 'text-[#8a5a2f]',
//     pillBg: 'bg-[#8a5a2f]',
//     pillText: 'text-white',
//     iconBtn: 'text-[#5b4636] border-[#e3d5b8] hover:bg-[#efe2c7]',
//     selectedVerseBg: 'bg-[#8a5a2f]/[0.08]',
//   },
//   dark: {
//     label: 'Dark',
//     icon: Moon,
//     pageBg: 'bg-slate-950',
//     cardBg: 'bg-slate-900',
//     toolbarBg: 'bg-slate-900/80',
//     border: 'border-slate-800',
//     heading: 'text-teal-300',
//     text: 'text-slate-100',
//     subText: 'text-slate-500',
//     verseNum: 'text-teal-400',
//     pillBg: 'bg-teal-600',
//     pillText: 'text-white',
//     iconBtn: 'text-slate-200 border-slate-700 hover:bg-slate-800',
//     selectedVerseBg: 'bg-white/[0.06]',
//   },
// };

// function loadPref(key, fallback) {
//   if (typeof window === 'undefined') return fallback;
//   try {
//     const raw = window.localStorage.getItem(key);
//     return raw !== null ? raw : fallback;
//   } catch {
//     return fallback;
//   }
// }

// function savePref(key, value) {
//   if (typeof window === 'undefined') return;
//   try {
//     window.localStorage.setItem(key, value);
//   } catch {
//     /* ignore quota / privacy-mode errors */
//   }
// }

// /* ------------------------------------------------------------------ */
// /*  Small shared bits                                                   */
// /* ------------------------------------------------------------------ */

// function IconButton({ onClick, disabled, className = '', children, ariaLabel }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       aria-label={ariaLabel}
//       className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
//     >
//       {children}
//     </button>
//   );
// }

// function ModalShell({ onClose, children, widthClass = 'max-w-md' }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 px-0 sm:items-center sm:px-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ y: 40, opacity: 0, scale: 0.98 }}
//         animate={{ y: 0, opacity: 1, scale: 1 }}
//         exit={{ y: 40, opacity: 0, scale: 0.98 }}
//         transition={{ type: 'spring', stiffness: 320, damping: 30 }}
//         onClick={(e) => e.stopPropagation()}
//         className={`flex max-h-[85vh] w-full ${widthClass} flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl`}
//       >
//         {children}
//       </motion.div>
//     </motion.div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Book / Chapter picker                                                */
// /* ------------------------------------------------------------------ */

// function ReferencePicker({ book, chapter, onSelect, onClose }) {
//   const [step, setStep] = useState('book'); // "book" | "chapter"
//   const [tab, setTab] = useState(BOOKS.find((b) => b.name === book)?.testament || 'OT');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [pendingBook, setPendingBook] = useState(book);

//   const visibleBooks = useMemo(() => {
//     const term = searchTerm.trim().toLowerCase();
//     if (term) return BOOKS.filter((b) => b.name.toLowerCase().includes(term));
//     return BOOKS.filter((b) => b.testament === tab);
//   }, [searchTerm, tab]);

//   const pendingBookData = BOOKS.find((b) => b.name === pendingBook);

//   return (
//     <ModalShell onClose={onClose}>
//       {step === 'book' ? (
//         <>
//           <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
//             <h2 className="text-[16px] font-bold text-[#0F3B39]">Choose a Book</h2>
//             <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100">
//               <X size={18} />
//             </button>
//           </div>

//           <div className="border-b border-neutral-100 px-5 py-3">
//             <div className="relative">
//               <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
//               <input
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search books..."
//                 className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 text-[13px] text-neutral-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
//               />
//             </div>

//             {!searchTerm && (
//               <div className="mt-3 flex gap-2">
//                 {['OT', 'NT'].map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => setTab(t)}
//                     className={`relative rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${
//                       tab === t ? 'text-white' : 'border border-neutral-200 bg-white text-neutral-500'
//                     }`}
//                   >
//                     {tab === t && (
//                       <motion.span
//                         layoutId="testament-pill"
//                         className="absolute inset-0 rounded-full bg-[#0F3B39]"
//                         transition={{ type: 'spring', stiffness: 500, damping: 40 }}
//                       />
//                     )}
//                     <span className="relative">{t === 'OT' ? 'Old Testament' : 'New Testament'}</span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex-1 overflow-y-auto px-2 py-2">
//             {visibleBooks.length === 0 ? (
//               <p className="py-10 text-center text-[13px] text-neutral-400">No books match "{searchTerm}"</p>
//             ) : (
//               visibleBooks.map((b) => (
//                 <button
//                   key={b.name}
//                   onClick={() => {
//                     setPendingBook(b.name);
//                     setStep('chapter');
//                   }}
//                   className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[14px] transition-colors hover:bg-teal-50 ${
//                     b.name === book ? 'font-bold text-[#0F3B39]' : 'font-medium text-neutral-700'
//                   }`}
//                 >
//                   <span>{b.name}</span>
//                   <span className="text-[11px] text-neutral-400">{b.chapters} ch</span>
//                 </button>
//               ))
//             )}
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-4">
//             <button
//               onClick={() => setStep('book')}
//               className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#0F3B39] hover:bg-teal-50"
//             >
//               <ArrowLeft size={17} />
//             </button>
//             <h2 className="flex-1 truncate text-[16px] font-bold text-[#0F3B39]">{pendingBook}</h2>
//             <button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100">
//               <X size={18} />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto px-4 py-4">
//             <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-6">
//               {Array.from({ length: pendingBookData?.chapters || 1 }, (_, i) => i + 1).map((c) => {
//                 const active = pendingBook === book && c === chapter;
//                 return (
//                   <button
//                     key={c}
//                     onClick={() => {
//                       onSelect(pendingBook, c);
//                       onClose();
//                     }}
//                     className={`flex h-11 items-center justify-center rounded-xl text-[13px] font-semibold transition-colors ${
//                       active ? 'bg-[#0F3B39] text-white' : 'bg-neutral-50 text-neutral-700 hover:bg-teal-50'
//                     }`}
//                   >
//                     {c}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </>
//       )}
//     </ModalShell>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Reading settings panel                                              */
// /* ------------------------------------------------------------------ */

// function SettingsPanel({ fontIndex, setFontIndex, themeKey, setThemeKey, onClose }) {
//   return (
//     <ModalShell onClose={onClose} widthClass="max-w-sm">
//       <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
//         <h2 className="flex items-center gap-2 text-[16px] font-bold text-[#0F3B39]">
//           <SlidersHorizontal size={16} /> Reading Settings
//         </h2>
//         <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100">
//           <X size={18} />
//         </button>
//       </div>

//       <div className="space-y-6 px-5 py-5">
//         <div>
//           <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-neutral-400">Font Size</p>
//           <div className="grid grid-cols-4 gap-2">
//             {FONT_SIZES.map((f, i) => (
//               <button
//                 key={f.key}
//                 onClick={() => setFontIndex(i)}
//                 className={`flex h-11 items-center justify-center rounded-xl border text-[13px] font-bold transition-colors ${
//                   fontIndex === i
//                     ? 'border-[#0F3B39] bg-[#0F3B39] text-white'
//                     : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
//                 }`}
//               >
//                 {f.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-neutral-400">Reading Theme</p>
//           <div className="grid grid-cols-3 gap-2">
//             {Object.entries(THEMES).map(([key, t]) => {
//               const Icon = t.icon;
//               const active = themeKey === key;
//               return (
//                 <button
//                   key={key}
//                   onClick={() => setThemeKey(key)}
//                   className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[12px] font-semibold transition-colors ${
//                     active ? 'border-[#0F3B39] ring-1 ring-[#0F3B39]' : 'border-neutral-200 hover:bg-neutral-50'
//                   } ${t.pageBg} ${t.text}`}
//                 >
//                   <Icon size={16} />
//                   {t.label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </ModalShell>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Main component                                                      */
// /* ------------------------------------------------------------------ */

// const Bible = () => {
//   const [book, setBook] = useState('Psalms');
//   const [chapter, setChapter] = useState(23);
//   const [verses, setVerses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);

//   const [pickerOpen, setPickerOpen] = useState(false);
//   const [settingsOpen, setSettingsOpen] = useState(false);

//   const [fontIndex, setFontIndex] = useState(() => {
//     const idx = FONT_SIZES.findIndex((f) => f.key === loadPref('bible-font-size', 'md'));
//     return idx >= 0 ? idx : 1;
//   });
//   const [themeKey, setThemeKey] = useState(() => loadPref('bible-theme', 'light'));

//   const [selectedVerse, setSelectedVerse] = useState(null);
//   const [highlighted, setHighlighted] = useState(new Set());
//   const [copiedVerse, setCopiedVerse] = useState(null);

//   useEffect(() => savePref('bible-font-size', FONT_SIZES[fontIndex].key), [fontIndex]);
//   useEffect(() => savePref('bible-theme', themeKey), [themeKey]);

//   const theme = THEMES[themeKey] || THEMES.light;
//   const fontSize = FONT_SIZES[fontIndex];

//   const bookIndex = BOOKS.findIndex((b) => b.name === book);
//   const currentBook = BOOKS[bookIndex] || BOOKS[18]; // fall back to Psalms
//   const canGoPrev = !(bookIndex <= 0 && chapter <= 1);
//   const canGoNext = !(bookIndex >= BOOKS.length - 1 && chapter >= currentBook.chapters);

//   const loadChapter = async (b, c) => {
//     setLoading(true);
//     setError(false);
//     setSelectedVerse(null);
//     setHighlighted(new Set());
//     try {
//       const response = await fetch(`https://bible-api.com/${encodeURIComponent(`${b} ${c}`)}`);
//       if (!response.ok) throw new Error('Request failed');
//       const data = await response.json();
//       setVerses(data.verses || []);
//     } catch (err) {
//       console.error(err);
//       setError(true);
//       setVerses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadChapter(book, chapter);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [book, chapter]);

//   const goPrev = () => {
//     if (!canGoPrev) return;
//     if (chapter > 1) {
//       setChapter((c) => c - 1);
//     } else {
//       const prev = BOOKS[bookIndex - 1];
//       setBook(prev.name);
//       setChapter(prev.chapters);
//     }
//   };

//   const goNext = () => {
//     if (!canGoNext) return;
//     if (chapter < currentBook.chapters) {
//       setChapter((c) => c + 1);
//     } else {
//       const next = BOOKS[bookIndex + 1];
//       setBook(next.name);
//       setChapter(1);
//     }
//   };

//   const handleSelectReference = (b, c) => {
//     setBook(b);
//     setChapter(c);
//   };

//   const toggleHighlight = (verseNum) => {
//     setHighlighted((prev) => {
//       const next = new Set(prev);
//       if (next.has(verseNum)) next.delete(verseNum);
//       else next.add(verseNum);
//       return next;
//     });
//   };

//   const handleCopyVerse = async (v) => {
//     const reference = `${book} ${chapter}:${v.verse}`;
//     const content = `"${v.text.trim()}" — ${reference}`;
//     try {
//       await navigator.clipboard.writeText(content);
//       setCopiedVerse(v.verse);
//       setTimeout(() => setCopiedVerse((cur) => (cur === v.verse ? null : cur)), 1600);
//     } catch (err) {
//       console.error('Copy failed:', err);
//     }
//   };

//   const progressPct = Math.round((chapter / currentBook.chapters) * 100);

//   return (
//     <div className={`flex h-screen flex-col items-center overflow-hidden px-2 py-2 transition-colors md:p-8 ${theme.pageBg}`}>
//       {/* Header */}
//       <div className={`mb-5 flex w-full max-w-4xl shrink-0 items-center justify-center gap-3 text-center ${theme.heading}`}>
//         <BookOpen className="text-2xl md:text-3xl" />
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Scripture Reader</h1>
//           <p className={`text-[11px] font-medium ${theme.subText}`}>66 Books · Old &amp; New Testament</p>
//         </div>
//       </div>

//       {/* Main card */}
//       <div className={`flex h-full w-full max-w-lg flex-col overflow-hidden rounded-3xl border shadow-lg md:max-w-4xl ${theme.cardBg} ${theme.border}`}>
//         {/* Toolbar */}
//         <div className={`sticky top-0 z-10 shrink-0 border-b backdrop-blur-sm ${theme.border} ${theme.toolbarBg}`}>
//           <div className="flex items-center gap-2 p-4">
//             <IconButton onClick={goPrev} disabled={!canGoPrev} className={theme.iconBtn} ariaLabel="Previous chapter">
//               <ChevronLeft size={18} />
//             </IconButton>

//             <button
//               onClick={() => setPickerOpen(true)}
//               className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold shadow-sm transition-opacity hover:opacity-90 ${theme.pillBg} ${theme.pillText}`}
//             >
//               <span className="truncate">{book} {chapter}</span>
//               <ChevronDown size={14} className="shrink-0 opacity-80" />
//             </button>

//             <IconButton onClick={goNext} disabled={!canGoNext} className={theme.iconBtn} ariaLabel="Next chapter">
//               <ChevronRight size={18} />
//             </IconButton>

//             <IconButton onClick={() => setSettingsOpen(true)} className={theme.iconBtn} ariaLabel="Reading settings">
//               <SlidersHorizontal size={16} />
//             </IconButton>
//           </div>

//           {/* Chapter progress bar */}
//           <div className="h-1 w-full bg-black/5">
//             <motion.div
//               className={`h-full ${theme.pillBg}`}
//               initial={false}
//               animate={{ width: `${progressPct}%` }}
//               transition={{ type: 'spring', stiffness: 120, damping: 20 }}
//             />
//           </div>
//         </div>

//         {/* Scripture area */}
//         <div className="flex-1 overflow-y-auto px-6 py-6 md:px-14 md:py-10">
//           <div className="mb-1 flex items-baseline justify-between">
//             <h2 className={`text-3xl font-bold md:text-4xl ${theme.heading}`}>{book} {chapter}</h2>
//             <span className={`text-[12px] font-medium ${theme.subText}`}>
//               Chapter {chapter} of {currentBook.chapters}
//             </span>
//           </div>
//           <div className={`mb-6 border-t ${theme.border}`} />

//           {loading ? (
//             <div className="space-y-5">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <div key={i} className="animate-pulse space-y-2">
//                   <div className={`h-4 w-full rounded ${themeKey === 'dark' ? 'bg-slate-800' : 'bg-black/5'}`} />
//                   <div className={`h-4 w-4/5 rounded ${themeKey === 'dark' ? 'bg-slate-800' : 'bg-black/5'}`} />
//                 </div>
//               ))}
//             </div>
//           ) : error ? (
//             <div className="flex flex-col items-center gap-3 py-16 text-center">
//               <AlertCircle size={28} className="text-rose-400" />
//               <p className={`text-[14px] font-medium ${theme.text}`}>Couldn't load this chapter.</p>
//               <button
//                 onClick={() => loadChapter(book, chapter)}
//                 className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold ${theme.pillBg} ${theme.pillText}`}
//               >
//                 <RotateCcw size={13} /> Try Again
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-1">
//               {verses.map((v) => {
//                 const isSelected = selectedVerse === v.verse;
//                 const isHighlighted = highlighted.has(v.verse);
//                 return (
//                   <div key={v.verse}>
//                     <p
//                       onClick={() => setSelectedVerse(isSelected ? null : v.verse)}
//                       className={`-mx-2 cursor-pointer rounded-lg px-2 py-1.5 font-serif leading-relaxed transition-colors ${fontSize.verseClass} ${theme.text} ${
//                         isHighlighted ? 'bg-amber-300/30' : isSelected ? theme.selectedVerseBg : ''
//                       }`}
//                     >
//                       <sup className={`mr-2 text-base font-bold ${theme.verseNum}`}>{v.verse}</sup>
//                       {v.text}
//                     </p>

//                     <AnimatePresence initial={false}>
//                       {isSelected && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: 'auto', opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           transition={{ duration: 0.18 }}
//                           className="overflow-hidden"
//                         >
//                           <div className="-mx-2 flex items-center gap-2 px-2 pb-2 pt-1">
//                             <button
//                               onClick={() => toggleHighlight(v.verse)}
//                               className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${theme.iconBtn}`}
//                             >
//                               <Highlighter size={13} />
//                               {isHighlighted ? 'Unhighlight' : 'Highlight'}
//                             </button>
//                             <button
//                               onClick={() => handleCopyVerse(v)}
//                               className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${theme.iconBtn}`}
//                             >
//                               {copiedVerse === v.verse ? <Check size={13} /> : <Copy size={13} />}
//                               {copiedVerse === v.verse ? 'Copied' : 'Copy'}
//                             </button>
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 );
//               })}

//               <div className={`mt-14 flex flex-col items-center gap-4 border-t pt-8 ${theme.border}`}>
//                 <span className={`text-[11px] font-bold uppercase tracking-widest ${theme.subText}`}>
//                   End of Chapter
//                 </span>
//                 <div className="flex gap-2.5">
//                   <button
//                     onClick={goPrev}
//                     disabled={!canGoPrev}
//                     className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${theme.iconBtn}`}
//                   >
//                     <ChevronLeft size={14} /> Previous
//                   </button>
//                   <button
//                     onClick={goNext}
//                     disabled={!canGoNext}
//                     className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 ${theme.pillBg}`}
//                   >
//                     Next <ChevronRight size={14} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modals */}
//       <AnimatePresence>
//         {pickerOpen && (
//           <ReferencePicker
//             book={book}
//             chapter={chapter}
//             onSelect={handleSelectReference}
//             onClose={() => setPickerOpen(false)}
//           />
//         )}
//         {settingsOpen && (
//           <SettingsPanel
//             fontIndex={fontIndex}
//             setFontIndex={setFontIndex}
//             themeKey={themeKey}
//             setThemeKey={setThemeKey}
//             onClose={() => setSettingsOpen(false)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Bible;








import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowUp,
  Search,
  X,
  Copy,
  Check,
  Highlighter,
  AlertCircle,
  RotateCcw,
  Volume2,
  Square,
} from 'lucide-react';
// Adjust this path to wherever ThemeContext actually lives relative to this
// file (e.g. '../../Context/ThemeContext' if this page sits in pages/User).
import { useTheme } from '../../Context/ThemeContext';

/* ------------------------------------------------------------------ */
/*  Bible book data — name, testament, and real chapter counts so the  */
/*  chapter picker only ever offers chapters that actually exist.       */
/* ------------------------------------------------------------------ */

const BOOKS = [
  // Old Testament
  { name: 'Genesis', chapters: 50, testament: 'OT' },
  { name: 'Exodus', chapters: 40, testament: 'OT' },
  { name: 'Leviticus', chapters: 27, testament: 'OT' },
  { name: 'Numbers', chapters: 36, testament: 'OT' },
  { name: 'Deuteronomy', chapters: 34, testament: 'OT' },
  { name: 'Joshua', chapters: 24, testament: 'OT' },
  { name: 'Judges', chapters: 21, testament: 'OT' },
  { name: 'Ruth', chapters: 4, testament: 'OT' },
  { name: '1 Samuel', chapters: 31, testament: 'OT' },
  { name: '2 Samuel', chapters: 24, testament: 'OT' },
  { name: '1 Kings', chapters: 22, testament: 'OT' },
  { name: '2 Kings', chapters: 25, testament: 'OT' },
  { name: '1 Chronicles', chapters: 29, testament: 'OT' },
  { name: '2 Chronicles', chapters: 36, testament: 'OT' },
  { name: 'Ezra', chapters: 10, testament: 'OT' },
  { name: 'Nehemiah', chapters: 13, testament: 'OT' },
  { name: 'Esther', chapters: 10, testament: 'OT' },
  { name: 'Job', chapters: 42, testament: 'OT' },
  { name: 'Psalms', chapters: 150, testament: 'OT' },
  { name: 'Proverbs', chapters: 31, testament: 'OT' },
  { name: 'Ecclesiastes', chapters: 12, testament: 'OT' },
  { name: 'Song of Solomon', chapters: 8, testament: 'OT' },
  { name: 'Isaiah', chapters: 66, testament: 'OT' },
  { name: 'Jeremiah', chapters: 52, testament: 'OT' },
  { name: 'Lamentations', chapters: 5, testament: 'OT' },
  { name: 'Ezekiel', chapters: 48, testament: 'OT' },
  { name: 'Daniel', chapters: 12, testament: 'OT' },
  { name: 'Hosea', chapters: 14, testament: 'OT' },
  { name: 'Joel', chapters: 3, testament: 'OT' },
  { name: 'Amos', chapters: 9, testament: 'OT' },
  { name: 'Obadiah', chapters: 1, testament: 'OT' },
  { name: 'Jonah', chapters: 4, testament: 'OT' },
  { name: 'Micah', chapters: 7, testament: 'OT' },
  { name: 'Nahum', chapters: 3, testament: 'OT' },
  { name: 'Habakkuk', chapters: 3, testament: 'OT' },
  { name: 'Zephaniah', chapters: 3, testament: 'OT' },
  { name: 'Haggai', chapters: 2, testament: 'OT' },
  { name: 'Zechariah', chapters: 14, testament: 'OT' },
  { name: 'Malachi', chapters: 4, testament: 'OT' },
  // New Testament
  { name: 'Matthew', chapters: 28, testament: 'NT' },
  { name: 'Mark', chapters: 16, testament: 'NT' },
  { name: 'Luke', chapters: 24, testament: 'NT' },
  { name: 'John', chapters: 21, testament: 'NT' },
  { name: 'Acts', chapters: 28, testament: 'NT' },
  { name: 'Romans', chapters: 16, testament: 'NT' },
  { name: '1 Corinthians', chapters: 16, testament: 'NT' },
  { name: '2 Corinthians', chapters: 13, testament: 'NT' },
  { name: 'Galatians', chapters: 6, testament: 'NT' },
  { name: 'Ephesians', chapters: 6, testament: 'NT' },
  { name: 'Philippians', chapters: 4, testament: 'NT' },
  { name: 'Colossians', chapters: 4, testament: 'NT' },
  { name: '1 Thessalonians', chapters: 5, testament: 'NT' },
  { name: '2 Thessalonians', chapters: 3, testament: 'NT' },
  { name: '1 Timothy', chapters: 6, testament: 'NT' },
  { name: '2 Timothy', chapters: 4, testament: 'NT' },
  { name: 'Titus', chapters: 3, testament: 'NT' },
  { name: 'Philemon', chapters: 1, testament: 'NT' },
  { name: 'Hebrews', chapters: 13, testament: 'NT' },
  { name: 'James', chapters: 5, testament: 'NT' },
  { name: '1 Peter', chapters: 5, testament: 'NT' },
  { name: '2 Peter', chapters: 3, testament: 'NT' },
  { name: '1 John', chapters: 5, testament: 'NT' },
  { name: '2 John', chapters: 1, testament: 'NT' },
  { name: '3 John', chapters: 1, testament: 'NT' },
  { name: 'Jude', chapters: 1, testament: 'NT' },
  { name: 'Revelation', chapters: 22, testament: 'NT' },
];

/* ------------------------------------------------------------------ */
/*  Small shared bits                                                   */
/* ------------------------------------------------------------------ */

function IconButton({ onClick, disabled, className = '', children, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
    >
      {children}
    </button>
  );
}

function ModalShell({ onClose, children, widthClass = 'max-w-md' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 px-0 sm:items-center sm:px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[85vh] w-full ${widthClass} flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Book / Chapter picker                                                */
/* ------------------------------------------------------------------ */

function ReferencePicker({ book, chapter, onSelect, onClose }) {
  const [step, setStep] = useState('book'); // "book" | "chapter"
  const [tab, setTab] = useState(BOOKS.find((b) => b.name === book)?.testament || 'OT');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingBook, setPendingBook] = useState(book);

  const visibleBooks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term) return BOOKS.filter((b) => b.name.toLowerCase().includes(term));
    return BOOKS.filter((b) => b.testament === tab);
  }, [searchTerm, tab]);

  const pendingBookData = BOOKS.find((b) => b.name === pendingBook);

  return (
    <ModalShell onClose={onClose}>
      {step === 'book' ? (
        <>
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="text-[16px] font-bold text-[#0F3B39]">Choose a Book</h2>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100">
              <X size={18} />
            </button>
          </div>

          <div className="border-b border-neutral-100 px-5 py-3">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books..."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 text-[13px] text-neutral-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {!searchTerm && (
              <div className="mt-3 flex gap-2">
                {['OT', 'NT'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                      tab === t ? 'text-white' : 'border border-neutral-200 bg-white text-neutral-500'
                    }`}
                  >
                    {tab === t && (
                      <motion.span
                        layoutId="testament-pill"
                        className="absolute inset-0 rounded-full bg-[#0F3B39]"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className="relative">{t === 'OT' ? 'Old Testament' : 'New Testament'}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2">
            {visibleBooks.length === 0 ? (
              <p className="py-10 text-center text-[13px] text-neutral-400">No books match "{searchTerm}"</p>
            ) : (
              visibleBooks.map((b) => (
                <button
                  key={b.name}
                  onClick={() => {
                    setPendingBook(b.name);
                    setStep('chapter');
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[14px] transition-colors hover:bg-teal-50 ${
                    b.name === book ? 'font-bold text-[#0F3B39]' : 'font-medium text-neutral-700'
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="text-[11px] text-neutral-400">{b.chapters} ch</span>
                </button>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-4">
            <button
              onClick={() => setStep('book')}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#0F3B39] hover:bg-teal-50"
            >
              <ArrowLeft size={17} />
            </button>
            <h2 className="flex-1 truncate text-[16px] font-bold text-[#0F3B39]">{pendingBook}</h2>
            <button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-6">
              {Array.from({ length: pendingBookData?.chapters || 1 }, (_, i) => i + 1).map((c) => {
                const active = pendingBook === book && c === chapter;
                return (
                  <button
                    key={c}
                    onClick={() => {
                      onSelect(pendingBook, c);
                      onClose();
                    }}
                    className={`flex h-11 items-center justify-center rounded-xl text-[13px] font-semibold transition-colors ${
                      active ? 'bg-[#0F3B39] text-white' : 'bg-neutral-50 text-neutral-700 hover:bg-teal-50'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */

const Bible = () => {
  const [book, setBook] = useState('Psalms');
  const [chapter, setChapter] = useState(23);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);

  // Appearance (theme + font size) now comes from the app-wide context —
  // set it once from the top bar and it applies everywhere, including here.
  const { theme, themeKey, fontSize } = useTheme();

  const [selectedVerse, setSelectedVerse] = useState(null);
  const [highlighted, setHighlighted] = useState(new Set());
  const [copiedVerse, setCopiedVerse] = useState(null);

  // "Listen" — reads the current chapter aloud with the browser's built-in
  // speech synthesis. No extra API needed.
  const [speaking, setSpeaking] = useState(false);
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Scroll-to-top — tracks the scripture panel's own scroll position (not
  // the window's) since that's the element that actually scrolls.
  const scrollRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const bookIndex = BOOKS.findIndex((b) => b.name === book);
  const currentBook = BOOKS[bookIndex] || BOOKS[18]; // fall back to Psalms
  const canGoPrev = !(bookIndex <= 0 && chapter <= 1);
  const canGoNext = !(bookIndex >= BOOKS.length - 1 && chapter >= currentBook.chapters);

  const loadChapter = async (b, c) => {
    setLoading(true);
    setError(false);
    setSelectedVerse(null);
    setHighlighted(new Set());
    try {
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(`${b} ${c}`)}`);
      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setVerses(data.verses || []);
    } catch (err) {
      console.error(err);
      setError(true);
      setVerses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChapter(book, chapter);
    // Stop any read-aloud in progress and snap the panel back to the top
    // whenever the chapter changes.
    if (speechSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setShowScrollTop(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, chapter]);

  // Stop speaking if the user navigates away from the page entirely.
  useEffect(() => {
    return () => {
      if (speechSupported) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goPrev = () => {
    if (!canGoPrev) return;
    if (chapter > 1) {
      setChapter((c) => c - 1);
    } else {
      const prev = BOOKS[bookIndex - 1];
      setBook(prev.name);
      setChapter(prev.chapters);
    }
  };

  const goNext = () => {
    if (!canGoNext) return;
    if (chapter < currentBook.chapters) {
      setChapter((c) => c + 1);
    } else {
      const next = BOOKS[bookIndex + 1];
      setBook(next.name);
      setChapter(1);
    }
  };

  const handleSelectReference = (b, c) => {
    setBook(b);
    setChapter(c);
  };

  const toggleHighlight = (verseNum) => {
    setHighlighted((prev) => {
      const next = new Set(prev);
      if (next.has(verseNum)) next.delete(verseNum);
      else next.add(verseNum);
      return next;
    });
  };

  const handleCopyVerse = async (v) => {
    const reference = `${book} ${chapter}:${v.verse}`;
    const content = `"${v.text.trim()}" — ${reference}`;
    try {
      await navigator.clipboard.writeText(content);
      setCopiedVerse(v.verse);
      setTimeout(() => setCopiedVerse((cur) => (cur === v.verse ? null : cur)), 1600);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const toggleReadAloud = () => {
    if (!speechSupported || verses.length === 0) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = `${book} chapter ${chapter}. ${verses.map((v) => v.text).join(' ')}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handleScripturePanelScroll = (e) => {
    setShowScrollTop(e.currentTarget.scrollTop > 320);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progressPct = Math.round((chapter / currentBook.chapters) * 100);

  return (
    <div className={`flex h-screen flex-col items-center overflow-hidden px-2 py-2 transition-colors md:p-8 ${theme.pageBg}`}>
      {/* Header */}
      <div className={`mb-5 flex w-full max-w-4xl shrink-0 items-center justify-center gap-3 text-center ${theme.heading}`}>
        <BookOpen className="text-2xl md:text-3xl" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Scripture Reader</h1>
          <p className={`text-[11px] font-medium ${theme.subText}`}>66 Books · Old &amp; New Testament</p>
        </div>
      </div>

      {/* Main card */}
      <div className={`relative flex h-full w-full max-w-lg flex-col overflow-hidden rounded-3xl border shadow-lg md:max-w-4xl ${theme.cardBg} ${theme.border}`}>
        {/* Toolbar */}
        <div className={`sticky top-0 z-10 shrink-0 border-b backdrop-blur-sm ${theme.border} ${theme.toolbarBg}`}>
          <div className="flex items-center gap-2 p-4">
            <IconButton onClick={goPrev} disabled={!canGoPrev} className={theme.iconBtn} ariaLabel="Previous chapter">
              <ChevronLeft size={18} />
            </IconButton>

            <button
              onClick={() => setPickerOpen(true)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold shadow-sm transition-opacity hover:opacity-90 ${theme.pillBg} ${theme.pillText}`}
            >
              <span className="truncate">{book} {chapter}</span>
              <ChevronDown size={14} className="shrink-0 opacity-80" />
            </button>

            <IconButton onClick={goNext} disabled={!canGoNext} className={theme.iconBtn} ariaLabel="Next chapter">
              <ChevronRight size={18} />
            </IconButton>

            {speechSupported && (
              <IconButton
                onClick={toggleReadAloud}
                disabled={loading || error || verses.length === 0}
                className={speaking ? `${theme.pillBg} ${theme.pillText} border-transparent` : theme.iconBtn}
                ariaLabel={speaking ? 'Stop reading aloud' : 'Listen to this chapter'}
              >
                {speaking ? <Square size={15} /> : <Volume2 size={17} />}
              </IconButton>
            )}
          </div>

          {/* Chapter progress bar */}
          <div className="h-1 w-full bg-black/5">
            <motion.div
              className={`h-full ${theme.pillBg}`}
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        {/* Scripture area */}
        <div
          ref={scrollRef}
          onScroll={handleScripturePanelScroll}
          className="flex-1 overflow-y-auto px-6 py-6 md:px-14 md:py-10"
        >
          <div className="mb-1 flex items-baseline justify-between">
            <h2 className={`text-3xl font-bold md:text-4xl ${theme.heading}`}>{book} {chapter}</h2>
            <span className={`text-[12px] font-medium ${theme.subText}`}>
              Chapter {chapter} of {currentBook.chapters}
            </span>
          </div>
          <div className={`mb-6 border-t ${theme.border}`} />

          {loading ? (
            <div className="space-y-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className={`h-4 w-full rounded ${themeKey === 'dark' ? 'bg-slate-800' : 'bg-black/5'}`} />
                  <div className={`h-4 w-4/5 rounded ${themeKey === 'dark' ? 'bg-slate-800' : 'bg-black/5'}`} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <AlertCircle size={28} className="text-rose-400" />
              <p className={`text-[14px] font-medium ${theme.text}`}>Couldn't load this chapter.</p>
              <button
                onClick={() => loadChapter(book, chapter)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold ${theme.pillBg} ${theme.pillText}`}
              >
                <RotateCcw size={13} /> Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {verses.map((v) => {
                const isSelected = selectedVerse === v.verse;
                const isHighlighted = highlighted.has(v.verse);
                return (
                  <div key={v.verse}>
                    <p
                      onClick={() => setSelectedVerse(isSelected ? null : v.verse)}
                      className={`-mx-2 cursor-pointer rounded-lg px-2 py-1.5 font-serif leading-relaxed transition-colors ${fontSize.verseClass} ${theme.text} ${
                        isHighlighted ? 'bg-amber-300/30' : isSelected ? theme.selectedVerseBg : ''
                      }`}
                    >
                      <sup className={`mr-2 text-base font-bold ${theme.verseNum}`}>{v.verse}</sup>
                      {v.text}
                    </p>

                    <AnimatePresence initial={false}>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden"
                        >
                          <div className="-mx-2 flex items-center gap-2 px-2 pb-2 pt-1">
                            <button
                              onClick={() => toggleHighlight(v.verse)}
                              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${theme.iconBtn}`}
                            >
                              <Highlighter size={13} />
                              {isHighlighted ? 'Unhighlight' : 'Highlight'}
                            </button>
                            <button
                              onClick={() => handleCopyVerse(v)}
                              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${theme.iconBtn}`}
                            >
                              {copiedVerse === v.verse ? <Check size={13} /> : <Copy size={13} />}
                              {copiedVerse === v.verse ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <div className={`mt-14 flex flex-col items-center gap-4 border-t pt-8 ${theme.border}`}>
                <span className={`text-[11px] font-bold uppercase tracking-widest ${theme.subText}`}>
                  End of Chapter
                </span>
                <div className="flex gap-2.5">
                  <button
                    onClick={goPrev}
                    disabled={!canGoPrev}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${theme.iconBtn}`}
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!canGoNext}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 ${theme.pillBg}`}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating scroll-to-top button — appears once the reader has
            scrolled a bit down into the chapter */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.85 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className={`absolute bottom-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full shadow-lg ${theme.pillBg} ${theme.pillText}`}
            >
              <ArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {pickerOpen && (
          <ReferencePicker
            book={book}
            chapter={chapter}
            onSelect={handleSelectReference}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bible;
