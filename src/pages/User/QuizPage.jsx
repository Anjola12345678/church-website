// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Clock,
//   Calendar,
//   BookOpen,
//   CheckCircle2,
//   XCircle,
//   Award,
//   Timer as TimerIcon,
//   Sparkles,
//   Pencil,
//   Loader2,
// } from "lucide-react";
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   query,
//   where,
//   orderBy,
//   serverTimestamp,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { db, auth } from "../../firebase/config";
// import quiz1 from '../images/quiz1.jpg';
// import { useTheme } from '../../Context/ThemeContext';
// const LETTERS = ["A", "B", "C", "D"];
// const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                            */
// /* ------------------------------------------------------------------ */

// function formatClock(totalSeconds) {
//   const m = Math.floor(totalSeconds / 60);
//   const s = totalSeconds % 60;
//   return `${m}:${String(s).padStart(2, "0")}`;
// }

// function getRank(scorePercent) {
//   if (scorePercent >= 90) return "Gold I";
//   if (scorePercent >= 75) return "Silver III";
//   if (scorePercent >= 50) return "Bronze II";
//   return "Unranked";
// }

// function getResultStatus(scorePercent) {
//   if (scorePercent >= 90) return "EXCELLENT";
//   if (scorePercent >= 80) return "GOOD";
//   if (scorePercent >= 60) return "PASSED";
//   return "AVERAGE";
// }

// // Combines the admin's "scheduleDate" (YYYY-MM-DD) + "scheduleTime" (HH:mm)
// // fields into a real Date object we can compare against "now".
// function parseScheduleDateTime(dateStr, timeStr) {
//   if (!dateStr) return null;
//   const [y, m, d] = dateStr.split("-").map(Number);
//   let hh = 0;
//   let mm = 0;
//   if (timeStr) {
//     const [h, mi] = timeStr.split(":").map(Number);
//     hh = Number.isFinite(h) ? h : 0;
//     mm = Number.isFinite(mi) ? mi : 0;
//   }
//   if (!y || !m || !d) return null;
//   const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
//   return isNaN(dt.getTime()) ? null : dt;
// }

// function formatDateTime(dt) {
//   if (!dt) return "";
//   const datePart = dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
//   const timePart = dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
//   return `${datePart} · ${timePart}`;
// }

// // Mirrors how the dashboard resolves the logged-in user's display name:
// // Firebase Auth gives the uid, then we look up their profile in /users/{uid}.
// function useCurrentUser() {
//   const [user, setUser] = useState({ uid: null, name: "", loading: true });

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (!firebaseUser) {
//         setUser({ uid: null, name: "", loading: false });
//         return;
//       }
//       try {
//         const snap = await getDoc(doc(db, "users", firebaseUser.uid));
//         const data = snap.exists() ? snap.data() : {};
//         const name =
//           data.name ||
//           data.fullName ||
//           data.displayName ||
//           [data.firstName, data.lastName].filter(Boolean).join(" ") ||
//           firebaseUser.displayName ||
//           firebaseUser.email ||
//           "Anonymous";
//         setUser({ uid: firebaseUser.uid, name, loading: false });
//       } catch (err) {
//         console.error("Failed to load user profile:", err);
//         setUser({
//           uid: firebaseUser.uid,
//           name: firebaseUser.displayName || firebaseUser.email || "Anonymous",
//           loading: false,
//         });
//       }
//     });
//     return () => unsub();
//   }, []);

//   return user;
// }

// // Converts an admin-authored Firestore "quizzes" doc into the shape the quiz-taking UI uses.
// function mapDocToQuiz(docSnap) {
//   const data = docSnap.data();
//   const postedAt = data.postedAt?.toDate ? data.postedAt.toDate() : new Date();
//   const isNew = Date.now() - postedAt.getTime() < 1000 * 60 * 60 * 24 * 3; // new for 3 days

//   const questions = (data.questions || []).map((q) => {
//     if (q.type === "fill") {
//       return { type: "fill", text: q.questionText, acceptedAnswer: q.acceptedAnswer || "" };
//     }
//     const opts = q.options || {};
//     return {
//       type: "objective",
//       text: q.questionText,
//       options: LETTERS.map((l) => opts[l] || ""),
//       correctIndex: LETTERS.indexOf((q.correctAnswer || "A").toUpperCase()),
//     };
//   });

//   const duration = data.duration || 10;
//   const scheduledStart = parseScheduleDateTime(data.scheduleDate, data.scheduleTime);
//   // The quiz's live window closes "duration" minutes after its scheduled start.
//   // Once that passes, anyone who hasn't completed it has missed it.
//   const scheduledDeadline = scheduledStart
//     ? new Date(scheduledStart.getTime() + duration * 60000)
//     : null;

//   return {
//     id: docSnap.id,
//     title: data.title || "Untitled Quiz",
//     description: data.description || "",
//     duration,
//     scheduleDate: data.scheduleDate || null,
//     scheduleTime: data.scheduleTime || null,
//     scheduledStart,
//     scheduledDeadline,
//     image: data.image || quiz1,
//     badge: isNew ? "New" : null,
//     questions,
//   };
// }

// /* ------------------------------------------------------------------ */
// /*  Reusable bits                                                      */
// /* ------------------------------------------------------------------ */

// function BackButton({ onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
//       aria-label="Go back"
//     >
//       <ArrowLeft size={17} />
//     </button>
//   );
// }

// // A single 5-petal flower, drawn in plain SVG so we can recolor it per-instance.
// function Flower({ size = 24, petalColor = "#0d9488", centerColor = "#fbbf24" }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
//       {[0, 72, 144, 216, 288].map((angle) => (
//         <ellipse
//           key={angle}
//           cx="20"
//           cy="11"
//           rx="6.5"
//           ry="9.5"
//           fill={petalColor}
//           opacity="0.9"
//           transform={`rotate(${angle} 20 20)`}
//         />
//       ))}
//       <circle cx="20" cy="20" r="5.5" fill={centerColor} />
//     </svg>
//   );
// }

// // Flowers bloom in and drift down across the whole screen — the celebration
// // animation shown on the congratulations screen after a quiz is submitted.
// function FlowerBurst() {
//   const palette = ["#0d9488", "#14b8a6", "#5eead4", "#f59e0b", "#fb923c", "#2dd4bf"];

//   const flowers = useMemo(
//     () =>
//       Array.from({ length: 26 }, (_, i) => {
//         const startLeft = Math.random() * 100;
//         return {
//           id: i,
//           startLeft,
//           endLeft: Math.max(0, Math.min(100, startLeft + (Math.random() - 0.5) * 36)),
//           size: 16 + Math.random() * 22,
//           rotateStart: Math.random() * 360,
//           rotateEnd: Math.random() * 540 - 270,
//           delay: Math.random() * 1.1,
//           duration: 3.4 + Math.random() * 2.4,
//           petalColor: palette[i % palette.length],
//         };
//       }),
//     []
//   );

//   return (
//     <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
//       {flowers.map((f) => (
//         <motion.div
//           key={f.id}
//           initial={{ opacity: 0, top: "-12%", left: `${f.startLeft}%`, rotate: f.rotateStart, scale: 0.3 }}
//           animate={{
//             opacity: [0, 1, 1, 0],
//             top: "112%",
//             left: `${f.endLeft}%`,
//             rotate: f.rotateEnd,
//             scale: 1,
//           }}
//           transition={{ duration: f.duration, delay: f.delay, ease: "easeIn" }}
//           className="absolute"
//         >
//           <Flower size={f.size} petalColor={f.petalColor} />
//         </motion.div>
//       ))}
//     </div>
//   );
// }

// function Spinner() {
//   return (
//     <div className="flex justify-center py-16">
//       <Loader2 size={22} className="animate-spin text-teal-600" />
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Main component                                                     */
// /* ------------------------------------------------------------------ */

// const QuizPage = () => {
//   const currentUser = useCurrentUser();

//   /* navigation: "list" | "taking" | "congrats" | "review" */
//   const [view, setView] = useState("list");
//   const [listTab, setListTab] = useState("active"); // "active" | "history"

//   /* ---------------- live Firestore data ---------------- */
//   const [activeQuizzes, setActiveQuizzes] = useState([]);
//   const [loadingActiveQuizzes, setLoadingActiveQuizzes] = useState(true);
//   const [history, setHistory] = useState([]);
//   const [loadingHistory, setLoadingHistory] = useState(true);

//   // Ticks periodically so scheduled start/deadline windows (and the "missed"
//   // / "clear after 1 day" states derived from them) update live without a refresh.
//   const [now, setNow] = useState(() => Date.now());
//   useEffect(() => {
//     const t = setInterval(() => setNow(Date.now()), 15000);
//     return () => clearInterval(t);
//   }, []);

//   // Only the quiz the admin currently has posted shows up here — once they
//   // post a new one, the previous quiz is archived server-side and drops out.
//   useEffect(() => {
//     const q = query(
//       collection(db, "quizzes"),
//       where("status", "==", "posted"),
//       orderBy("postedAt", "desc")
//     );
//     const unsub = onSnapshot(
//       q,
//       (snap) => {
//         setActiveQuizzes(snap.docs.map(mapDocToQuiz));
//         setLoadingActiveQuizzes(false);
//       },
//       (err) => {
//         console.error("Failed to load active quizzes:", err);
//         setLoadingActiveQuizzes(false);
//       }
//     );
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     if (currentUser.loading) return;
//     if (!currentUser.uid) {
//       setHistory([]);
//       setLoadingHistory(false);
//       return;
//     }
//     const q = query(
//       collection(db, "quiz"),
//       where("uid", "==", currentUser.uid),
//       orderBy("completedAt", "desc")
//     );
//     const unsub = onSnapshot(
//       q,
//       (snap) => {
//         setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//         setLoadingHistory(false);
//       },
//       (err) => {
//         console.error("Failed to load quiz history:", err);
//         setLoadingHistory(false);
//       }
//     );
//     return () => unsub();
//   }, [currentUser.uid, currentUser.loading]);

//   // Every quiz id the user has already attempted — used to lock "Start Quiz" to "Done".
//   const completedQuizIds = useMemo(
//     () => new Set(history.map((h) => h.quizId).filter(Boolean)),
//     [history]
//   );

//   // Derives per-quiz status (upcoming / missed / completed / clears from the
//   // Active tab) from the raw posted quizzes + the user's completion history + now.
//   const quizzesWithStatus = useMemo(() => {
//     return activeQuizzes.map((quiz) => {
//       const hasCompleted = completedQuizIds.has(quiz.id);
//       const isUpcoming = quiz.scheduledStart ? now < quiz.scheduledStart.getTime() : false;
//       const isExpired = quiz.scheduledDeadline ? now > quiz.scheduledDeadline.getTime() : false;
//       const isMissed = isExpired && !hasCompleted;

//       let hideFromActive = false;

//       if (hasCompleted) {
//         // Once completed, keep showing "Done" in the Active tab for 1 day,
//         // then it clears — the result still lives on in "My History".
//         const completedEntry = history.find((h) => h.quizId === quiz.id);
//         const completedAt = completedEntry?.completedAt?.toDate
//           ? completedEntry.completedAt.toDate().getTime()
//           : completedEntry?.completedDate
//           ? new Date(completedEntry.completedDate).getTime()
//           : null;
//         if (completedAt && now - completedAt > ONE_DAY_MS) hideFromActive = true;
//       } else if (isMissed && quiz.scheduledDeadline) {
//         // Same 1-day grace period for missed quizzes before they clear too.
//         if (now - quiz.scheduledDeadline.getTime() > ONE_DAY_MS) hideFromActive = true;
//       }

//       return { ...quiz, hasCompleted, isUpcoming, isMissed, hideFromActive };
//     });
//   }, [activeQuizzes, completedQuizIds, history, now]);

//   const visibleActiveQuizzes = useMemo(
//     () => quizzesWithStatus.filter((q) => !q.hideFromActive),
//     [quizzesWithStatus]
//   );

//   // Quizzes the user never attempted before their scheduled window closed —
//   // synthesized as "Missed" rows for the History tab (no Firestore doc exists for these).
//   const missedHistoryEntries = useMemo(() => {
//     return quizzesWithStatus
//       .filter((q) => q.isMissed)
//       .map((q) => ({
//         id: `missed-${q.id}`,
//         quizId: q.id,
//         quizTitle: q.title,
//         status: "MISSED",
//         scorePercent: null,
//         isMissedEntry: true,
//         completedAt: null,
//         completedDate: q.scheduledDeadline ? formatDateTime(q.scheduledDeadline) : "",
//         sortTime: q.scheduledDeadline ? q.scheduledDeadline.getTime() : 0,
//       }));
//   }, [quizzesWithStatus]);

//   const combinedHistory = useMemo(() => {
//     const real = history.map((h) => ({
//       ...h,
//       sortTime: h.completedAt?.toDate
//         ? h.completedAt.toDate().getTime()
//         : h.completedDate
//         ? new Date(h.completedDate).getTime()
//         : 0,
//     }));
//     return [...real, ...missedHistoryEntries].sort((a, b) => b.sortTime - a.sortTime);
//   }, [history, missedHistoryEntries]);

//   const [activeQuiz, setActiveQuizState] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState([]); // index (objective) or string (fill) per question
//   const [secondsLeft, setSecondsLeft] = useState(0);
//   const [elapsedSeconds, setElapsedSeconds] = useState(0);
//   const [submitting, setSubmitting] = useState(false);

//   const [lastResult, setLastResult] = useState(null); // result object for congrats/review
//   const [reviewSource, setReviewSource] = useState(null); // "live" | "history"

//   const timerRef = useRef(null);

//   /* ---------------- timer ---------------- */
//   useEffect(() => {
//     if (view !== "taking") {
//       clearInterval(timerRef.current);
//       return;
//     }
//     timerRef.current = setInterval(() => {
//       setSecondsLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerRef.current);
//           handleSubmitQuiz(); // auto-submit when time runs out
//           return 0;
//         }
//         return prev - 1;
//       });
//       setElapsedSeconds((e) => e + 1);
//     }, 1000);
//     return () => clearInterval(timerRef.current);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [view]);

//   /* ---------------- actions ---------------- */

//   const handleStartQuiz = (quiz) => {
//     if (completedQuizIds.has(quiz.id)) return; // already attempted — can't retake
//     if (quiz.isMissed) return; // scheduled window has closed — missed it
//     if (quiz.isUpcoming) return; // not open yet
//     setActiveQuizState(quiz);
//     setCurrentIndex(0);
//     setAnswers(Array(quiz.questions.length).fill(null));
//     setSecondsLeft(quiz.duration * 60);
//     setElapsedSeconds(0);
//     setView("taking");
//   };

//   const handleSelectOption = (optionIndex) => {
//     setAnswers((prev) => {
//       const next = [...prev];
//       next[currentIndex] = optionIndex;
//       return next;
//     });
//   };

//   const handleFillChange = (value) => {
//     setAnswers((prev) => {
//       const next = [...prev];
//       next[currentIndex] = value;
//       return next;
//     });
//   };

//   const isCurrentAnswered = () => {
//     if (!activeQuiz) return false;
//     const q = activeQuiz.questions[currentIndex];
//     const a = answers[currentIndex];
//     if (q.type === "fill") return typeof a === "string" && a.trim().length > 0;
//     return a !== null && a !== undefined;
//   };

//   const handleNext = () => {
//     if (currentIndex < activeQuiz.questions.length - 1) {
//       setCurrentIndex((i) => i + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) setCurrentIndex((i) => i - 1);
//   };

//   const handleSubmitQuiz = async () => {
//     clearInterval(timerRef.current);
//     if (!activeQuiz) return;

//     const details = activeQuiz.questions.map((q, i) => {
//       const selected = answers[i];
//       let isCorrect = false;
//       if (q.type === "fill") {
//         isCorrect =
//           typeof selected === "string" &&
//           selected.trim().toLowerCase() === (q.acceptedAnswer || "").trim().toLowerCase();
//       } else {
//         isCorrect = selected === q.correctIndex;
//       }
//       return {
//         type: q.type,
//         text: q.text,
//         options: q.options || null,
//         acceptedAnswer: q.acceptedAnswer || null,
//         selected: selected ?? null,
//         correctIndex: q.correctIndex ?? null,
//         isCorrect,
//       };
//     });

//     const correctCount = details.filter((d) => d.isCorrect).length;
//     const attemptedQuestions = details.filter(
//       (d) => d.selected !== null && d.selected !== undefined && d.selected !== ""
//     ).length;
//     const total = details.length;
//     const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
//     const status = getResultStatus(scorePercent);
//     const timeTakenSeconds = elapsedSeconds;
//     const timeTakenLabel = `${Math.floor(elapsedSeconds / 60)}m ${String(elapsedSeconds % 60).padStart(2, "0")}s`;
//     const rank = getRank(scorePercent);
//     const completedDate = new Date().toLocaleDateString(undefined, {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });

//     const resultPayload = {
//       uid: currentUser.uid || null,
//       candidateName: currentUser.name || "Anonymous",
//       quizId: activeQuiz.id,
//       quizTitle: activeQuiz.title,
//       totalQuestions: total,
//       attemptedQuestions,
//       correctCount,
//       scorePercent,
//       status,
//       timeTakenSeconds,
//       timeTakenLabel,
//       rank,
//       details,
//     };

//     // Show it in "My History" and flip the quiz card to "Done" immediately,
//     // without waiting on the round trip to Firestore.
//     const optimisticId = `optimistic-${Date.now()}`;
//     setHistory((prev) => [{ id: optimisticId, completedDate, ...resultPayload }, ...prev]);

//     const localResult = { id: optimisticId, completedDate, ...resultPayload };
//     setLastResult(localResult);
//     setReviewSource("live");
//     setView("congrats");

//     setSubmitting(true);
//     try {
//       if (currentUser.uid) {
//         await addDoc(collection(db, "quiz"), {
//           ...resultPayload,
//           completedAt: serverTimestamp(),
//         });
//         // the live "quiz" listener will replace the optimistic entry above
//         // with the real, server-confirmed document automatically.
//       } else {
//         console.warn("No logged-in user — quiz result was not saved to Firestore.");
//       }
//     } catch (err) {
//       console.error("Failed to save quiz result:", err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const openReview = (result, source) => {
//     if (result.isMissedEntry) return; // nothing to review for a missed quiz
//     setLastResult(result);
//     setReviewSource(source);
//     setView("review");
//   };

//   const goToList = (tab) => {
//     setActiveQuizState(null);
//     if (tab) setListTab(tab);
//     setView("list");
//   };

//   /* ------------------------------------------------------------------ */
//   /*  Screens                                                            */
//   /* ------------------------------------------------------------------ */

//   const progressPct = activeQuiz
//     ? Math.round(((currentIndex + 1) / activeQuiz.questions.length) * 100)
//     : 0;

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-8">
//       <div className="mx-auto max-w-md">
//         <AnimatePresence mode="wait">
//           {/* ============================== LIST ============================== */}
//           {view === "list" && (
//             <motion.div
//               key="list"
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.2 }}
//             >
//               <h1 className="text-2xl font-bold text-slate-900">Bible Study Quizzes</h1>
//               <p className="mb-5 text-sm text-slate-500">Challenge your knowledge and grow in the Word.</p>

//               <div className="mb-5 flex items-center gap-6 border-b border-slate-200">
//                 {[
//                   { key: "active", label: "Active Quizzes" },
//                   { key: "history", label: "My History" },
//                 ].map((tab) => (
//                   <button
//                     key={tab.key}
//                     onClick={() => setListTab(tab.key)}
//                     className={`relative pb-3 text-sm font-semibold transition-colors ${
//                       listTab === tab.key ? "text-teal-700" : "text-slate-400 hover:text-slate-600"
//                     }`}
//                   >
//                     {tab.label}
//                     {listTab === tab.key && (
//                       <motion.span
//                         layoutId="list-tab-underline"
//                         className="absolute -bottom-px left-0 right-0 h-[2px] bg-teal-700"
//                         transition={{ type: "spring", stiffness: 500, damping: 40 }}
//                       />
//                     )}
//                   </button>
//                 ))}
//               </div>

//               {listTab === "active" ? (
//                 loadingActiveQuizzes ? (
//                   <Spinner />
//                 ) : visibleActiveQuizzes.length === 0 ? (
//                   <p className="py-10 text-center text-sm text-slate-400">
//                     No quizzes have been posted yet. Check back soon!
//                   </p>
//                 ) : (
//                   <div className="space-y-4">
//                     {visibleActiveQuizzes.map((quiz, i) => {
//                       const isDone = quiz.hasCompleted;
//                       const isMissed = quiz.isMissed;
//                       const isUpcoming = quiz.isUpcoming;
//                       const isLocked = isDone || isMissed || isUpcoming;

//                       let buttonLabel = "Start Quiz";
//                       if (isDone) buttonLabel = "Done";
//                       else if (isMissed) buttonLabel = "Missed";
//                       else if (isUpcoming) buttonLabel = "Not Yet Open";

//                       return (
//                         <motion.div
//                           key={quiz.id}
//                           initial={{ opacity: 0, y: 12 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: i * 0.06 }}
//                           className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
//                         >
//                           <div className="relative h-36 w-full">
//                             <img src={quiz1} alt={quiz.title} className="h-full w-full object-cover" />
//                             {isDone && (
//                               <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-bold text-white shadow">
//                                 <CheckCircle2 size={11} /> Completed
//                               </span>
//                             )}
//                             {!isDone && isMissed && (
//                               <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white shadow">
//                                 <XCircle size={11} /> Missed
//                               </span>
//                             )}
//                             {!isDone && !isMissed && isUpcoming && (
//                               <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
//                                 <Calendar size={11} /> Upcoming
//                               </span>
//                             )}
//                             {!isDone && !isMissed && !isUpcoming && quiz.badge && (
//                               <span className="absolute right-3 top-3 rounded-full bg-teal-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
//                                 {quiz.badge}
//                               </span>
//                             )}
//                           </div>
//                           <div className="p-4">
//                             <h3 className="mb-1.5 text-[15px] font-bold text-slate-900">{quiz.title}</h3>
//                             <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
//                               <span className="flex items-center gap-1">
//                                 <Clock size={13} /> {quiz.duration} mins
//                               </span>
//                               <span className="flex items-center gap-1">
//                                 <BookOpen size={13} /> {quiz.questions.length} Questions
//                               </span>
//                               {quiz.scheduledStart && (
//                                 <span className="flex items-center gap-1">
//                                   <Calendar size={13} /> {formatDateTime(quiz.scheduledStart)}
//                                 </span>
//                               )}
//                             </div>
//                             <motion.button
//                               whileTap={!isLocked ? { scale: 0.98 } : {}}
//                               onClick={() => handleStartQuiz(quiz)}
//                               disabled={isLocked || quiz.questions.length === 0}
//                               className={`flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold shadow-sm transition-colors disabled:cursor-not-allowed ${
//                                 isDone
//                                   ? "bg-slate-100 text-slate-400"
//                                   : isMissed
//                                   ? "bg-rose-50 text-rose-400"
//                                   : isUpcoming
//                                   ? "bg-amber-50 text-amber-500"
//                                   : "bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-50"
//                               }`}
//                             >
//                               {isDone && <CheckCircle2 size={15} />}
//                               {isMissed && <XCircle size={15} />}
//                               {buttonLabel}
//                             </motion.button>
//                           </div>
//                         </motion.div>
//                       );
//                     })}
//                   </div>
//                 )
//               ) : loadingHistory ? (
//                 <Spinner />
//               ) : (
//                 <div className="space-y-3">
//                   {combinedHistory.length === 0 && (
//                     <p className="py-10 text-center text-sm text-slate-400">
//                       You haven't completed any quizzes yet.
//                     </p>
//                   )}
//                   {combinedHistory.map((h, i) => {
//                     const isMissedEntry = !!h.isMissedEntry;
//                     return (
//                       <motion.div
//                         key={h.id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: i * 0.05 }}
//                         className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
//                       >
//                         <span
//                           className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
//                             isMissedEntry ? "bg-rose-50 text-rose-500" : "bg-teal-50 text-teal-600"
//                           }`}
//                         >
//                           {isMissedEntry ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
//                         </span>
//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-[14px] font-bold text-slate-900">{h.quizTitle}</p>
//                           <p className="text-[12px] text-slate-400">
//                             {isMissedEntry ? "Missed on " : "Completed on "}
//                             {h.completedAt?.toDate
//                               ? h.completedAt.toDate().toLocaleDateString(undefined, {
//                                   month: "short",
//                                   day: "numeric",
//                                   year: "numeric",
//                                 })
//                               : h.completedDate || ""}
//                           </p>
//                         </div>
//                         <div className="shrink-0 text-right">
//                           {isMissedEntry ? (
//                             <p className="mb-1 text-[13px] font-semibold text-rose-500">Missed</p>
//                           ) : (
//                             <>
//                               <p className="mb-1 text-[13px] font-bold text-slate-700">
//                                 {h.scorePercent}% <span className="font-normal text-slate-400">Score</span>
//                               </p>
//                               <button
//                                 onClick={() => openReview(h, "history")}
//                                 className="rounded-full border border-teal-600 px-3 py-1 text-[11px] font-semibold text-teal-700 hover:bg-teal-50"
//                               >
//                                 View Review
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               )}
//             </motion.div>
//           )}

//           {/* ============================== TAKING ============================== */}
//           {view === "taking" && activeQuiz && (
//             <motion.div
//               key="taking"
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.2 }}
//             >
//               <BackButton onClick={() => goToList("active")} />

//               <div className="mb-4 flex items-center justify-center gap-1.5 text-teal-700">
//                 <TimerIcon size={16} />
//                 <span className="text-sm font-bold">{formatClock(secondsLeft)}</span>
//               </div>

//               <div className="mb-1.5 flex items-center justify-between text-[12px] font-semibold">
//                 <span className="text-slate-500">
//                   Question {currentIndex + 1} of {activeQuiz.questions.length}
//                 </span>
//                 <span className="text-teal-700">{progressPct}% Completed</span>
//               </div>
//               <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
//                 <motion.div
//                   className="h-full rounded-full bg-teal-600"
//                   initial={{ width: 0 }}
//                   animate={{ width: `${progressPct}%` }}
//                   transition={{ type: "spring", stiffness: 120, damping: 18 }}
//                 />
//               </div>

//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={currentIndex}
//                   initial={{ opacity: 0, x: 16 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -16 }}
//                   transition={{ duration: 0.18 }}
//                 >
//                   <h2 className="mb-5 text-lg font-bold leading-snug text-slate-900">
//                     {activeQuiz.questions[currentIndex].text}
//                   </h2>

//                   {activeQuiz.questions[currentIndex].type === "fill" ? (
//                     <div className="mb-8">
//                       <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
//                         <Pencil size={16} className="shrink-0 text-teal-600" />
//                         <input
//                           value={answers[currentIndex] || ""}
//                           onChange={(e) => handleFillChange(e.target.value)}
//                           placeholder="Type your answer..."
//                           className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
//                         />
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="mb-8 space-y-3">
//                       {activeQuiz.questions[currentIndex].options.map((opt, i) => {
//                         const selected = answers[currentIndex] === i;
//                         return (
//                           <motion.button
//                             key={i}
//                             whileTap={{ scale: 0.985 }}
//                             onClick={() => handleSelectOption(i)}
//                             className={`flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left shadow-sm transition-colors ${
//                               selected
//                                 ? "border-teal-600 ring-1 ring-teal-600"
//                                 : "border-slate-100 hover:border-slate-200"
//                             }`}
//                           >
//                             <span
//                               className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold ${
//                                 selected ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500"
//                               }`}
//                             >
//                               {LETTERS[i]}
//                             </span>
//                             <span className="text-[14px] font-medium text-slate-700">{opt}</span>
//                           </motion.button>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </motion.div>
//               </AnimatePresence>

//               <div className="flex gap-2">
//                 {currentIndex > 0 && (
//                   <motion.button
//                     whileTap={{ scale: 0.97 }}
//                     onClick={handlePrevious}
//                     className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
//                   >
//                     <ArrowLeft size={16} />
//                     Previous
//                   </motion.button>
//                 )}

//                 {currentIndex < activeQuiz.questions.length - 1 ? (
//                   <motion.button
//                     whileTap={{ scale: 0.98 }}
//                     onClick={handleNext}
//                     disabled={!isCurrentAnswered()}
//                     className="flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-800 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     Next Question
//                     <ArrowRight size={16} />
//                   </motion.button>
//                 ) : (
//                   <motion.button
//                     whileTap={{ scale: 0.98 }}
//                     onClick={handleSubmitQuiz}
//                     disabled={!isCurrentAnswered() || submitting}
//                     className="flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-800 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
//                     {submitting ? "Submitting..." : "Submit Quiz"}
//                   </motion.button>
//                 )}
//               </div>
//             </motion.div>
//           )}

//           {/* ============================== CONGRATS ============================== */}
//           {view === "congrats" && lastResult && (
//             <motion.div
//               key="congrats"
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.2 }}
//             >
//               <BackButton onClick={() => goToList("active")} />

//               <FlowerBurst />

//               <div className="relative flex flex-col items-center pt-2 text-center">
//                 <motion.div
//                   initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
//                   animate={{ scale: 1, rotate: 0, opacity: 1 }}
//                   transition={{ type: "spring", stiffness: 200, damping: 14 }}
//                   className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-md"
//                 >
//                   <Award size={34} className="text-teal-700" />
//                 </motion.div>

//                 <h2 className="text-2xl font-bold text-slate-900">
//                   Congratulations{lastResult.candidateName ? `, ${lastResult.candidateName.split(" ")[0]}` : ""}!
//                 </h2>
//                 <p className="mb-6 max-w-xs text-sm text-slate-500">
//                   You've completed the {lastResult.quizTitle} challenge.
//                 </p>

//                 <motion.div
//                   initial={{ scale: 0.85, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ delay: 0.15 }}
//                   className="mb-6 flex h-28 w-28 flex-col items-center justify-center rounded-2xl border-[3px] border-teal-600 bg-white shadow-sm"
//                 >
//                   <span className="text-3xl font-extrabold text-teal-700">{lastResult.scorePercent}%</span>
//                   <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Score</span>
//                 </motion.div>

//                 <div className="mb-6 w-full space-y-2.5">
//                   <motion.button
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => openReview(lastResult, "live")}
//                     className="w-full rounded-full bg-teal-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
//                   >
//                     Review Detailed Results
//                   </motion.button>
//                   <motion.button
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => goToList("active")}
//                     className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
//                   >
//                     Back to Dashboard
//                   </motion.button>
//                 </div>

//                 <div className="w-full space-y-3">
//                   <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
//                     <span className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-slate-400">
//                       <Clock size={14} className="text-teal-600" /> Time Taken
//                     </span>
//                     <span className="text-sm font-bold text-slate-800">{lastResult.timeTakenLabel}</span>
//                   </div>
//                   <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
//                     <span className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-slate-400">
//                       <CheckCircle2 size={14} className="text-teal-600" /> Correct
//                     </span>
//                     <span className="text-sm font-bold text-slate-800">
//                       {lastResult.correctCount}/{lastResult.totalQuestions}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
//                     <span className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-slate-400">
//                       <Sparkles size={14} className="text-teal-600" /> Rank Up
//                     </span>
//                     <span className="text-sm font-bold text-slate-800">{lastResult.rank}</span>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* ============================== REVIEW ============================== */}
//           {view === "review" && lastResult && (
//             <motion.div
//               key="review"
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.2 }}
//             >
//               <BackButton
//                 onClick={() => (reviewSource === "live" ? setView("congrats") : goToList("history"))}
//               />

//               <h1 className="text-xl font-bold text-slate-900">{lastResult.quizTitle}</h1>
//               <p className="mb-4 text-sm text-slate-500">
//                 Review your detailed quiz results and answers below.
//               </p>

//               <div className="mb-5 flex items-center justify-between rounded-2xl bg-teal-50 px-4 py-3.5">
//                 <span className="text-[12px] font-semibold uppercase tracking-wide text-teal-700">Final Score</span>
//                 <span className="text-xl font-extrabold text-teal-700">
//                   {lastResult.scorePercent}%{" "}
//                   <span className="text-sm font-medium text-teal-600">
//                     {lastResult.correctCount}/{lastResult.totalQuestions}
//                   </span>
//                 </span>
//               </div>

//               <div className="mb-6 space-y-4">
//                 {lastResult.details.map((d, i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.04 }}
//                     className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
//                   >
//                     <div className="mb-2 flex items-center justify-between">
//                       <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
//                         Question {i + 1}
//                       </span>
//                       <span
//                         className={`flex items-center gap-1 text-[11px] font-bold ${
//                           d.isCorrect ? "text-emerald-600" : "text-rose-500"
//                         }`}
//                       >
//                         {d.isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
//                         {d.isCorrect ? "Correct" : "Incorrect"}
//                       </span>
//                     </div>
//                     <p className="mb-3 text-[14px] font-semibold text-slate-800">{d.text}</p>

//                     {d.type === "fill" ? (
//                       <div className="space-y-2">
//                         <div
//                           className={`flex items-center justify-between rounded-xl border px-3 py-2 text-[13px] font-medium ${
//                             d.isCorrect
//                               ? "border-emerald-500 bg-emerald-50 text-emerald-700"
//                               : "border-rose-400 bg-rose-50 text-rose-600"
//                           }`}
//                         >
//                           <span className="flex items-center gap-2">
//                             {d.isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
//                             Your answer: {d.selected || "—"}
//                           </span>
//                         </div>
//                         {!d.isCorrect && (
//                           <div className="flex items-center justify-between rounded-xl border border-emerald-500 bg-emerald-50 px-3 py-2 text-[13px] font-medium text-emerald-700">
//                             <span className="flex items-center gap-2">
//                               <CheckCircle2 size={14} />
//                               Correct answer: {d.acceptedAnswer}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="space-y-2">
//                         {d.options.map((opt, oi) => {
//                           const isSelected = d.selected === oi;
//                           const isAnswer = d.correctIndex === oi;
//                           let style = "border-slate-100 text-slate-500";
//                           if (isAnswer) style = "border-emerald-500 bg-emerald-50 text-emerald-700";
//                           else if (isSelected && !d.isCorrect) style = "border-rose-400 bg-rose-50 text-rose-600";

//                           return (
//                             <div
//                               key={oi}
//                               className={`flex items-center justify-between rounded-xl border px-3 py-2 text-[13px] font-medium ${style}`}
//                             >
//                               <span className="flex items-center gap-2">
//                                 {isAnswer ? (
//                                   <CheckCircle2 size={14} className="text-emerald-600" />
//                                 ) : isSelected ? (
//                                   <XCircle size={14} className="text-rose-500" />
//                                 ) : (
//                                   <span className="h-3.5 w-3.5 rounded-full border border-slate-300" />
//                                 )}
//                                 {opt}
//                               </span>
//                               {isAnswer && (
//                                 <span className="text-[10px] font-bold uppercase text-emerald-600">
//                                   Correct answer
//                                 </span>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </motion.div>
//                 ))}
//               </div>

//               <motion.button
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => goToList("history")}
//                 className="w-full rounded-full bg-teal-800 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-900"
//               >
//                 Done
//               </motion.button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default QuizPage;










import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  BookOpen,
  CheckCircle2,
  XCircle,
  Award,
  Timer as TimerIcon,
  Sparkles,
  Pencil,
  Loader2,
} from "lucide-react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase/config";
import quiz1 from '../images/quiz1.jpg';
import { useTheme } from '../../Context/ThemeContext';
const LETTERS = ["A", "B", "C", "D"];
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getRank(scorePercent) {
  if (scorePercent >= 90) return "Gold I";
  if (scorePercent >= 75) return "Silver III";
  if (scorePercent >= 50) return "Bronze II";
  return "Unranked";
}

function getResultStatus(scorePercent) {
  if (scorePercent >= 90) return "EXCELLENT";
  if (scorePercent >= 80) return "GOOD";
  if (scorePercent >= 60) return "PASSED";
  return "AVERAGE";
}

// Combines the admin's "scheduleDate" (YYYY-MM-DD) + "scheduleTime" (HH:mm)
// fields into a real Date object we can compare against "now".
function parseScheduleDateTime(dateStr, timeStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  let hh = 0;
  let mm = 0;
  if (timeStr) {
    const [h, mi] = timeStr.split(":").map(Number);
    hh = Number.isFinite(h) ? h : 0;
    mm = Number.isFinite(mi) ? mi : 0;
  }
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
  return isNaN(dt.getTime()) ? null : dt;
}

function formatDateTime(dt) {
  if (!dt) return "";
  const datePart = dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const timePart = dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${datePart} · ${timePart}`;
}

// Mirrors how the dashboard resolves the logged-in user's display name:
// Firebase Auth gives the uid, then we look up their profile in /users/{uid}.
function useCurrentUser() {
  const [user, setUser] = useState({ uid: null, name: "", loading: true });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser({ uid: null, name: "", loading: false });
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        const data = snap.exists() ? snap.data() : {};
        const name =
          data.name ||
          data.fullName ||
          data.displayName ||
          [data.firstName, data.lastName].filter(Boolean).join(" ") ||
          firebaseUser.displayName ||
          firebaseUser.email ||
          "Anonymous";
        setUser({ uid: firebaseUser.uid, name, loading: false });
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email || "Anonymous",
          loading: false,
        });
      }
    });
    return () => unsub();
  }, []);

  return user;
}

// Converts an admin-authored Firestore "quizzes" doc into the shape the quiz-taking UI uses.
function mapDocToQuiz(docSnap) {
  const data = docSnap.data();
  const postedAt = data.postedAt?.toDate ? data.postedAt.toDate() : new Date();
  const isNew = Date.now() - postedAt.getTime() < 1000 * 60 * 60 * 24 * 3; // new for 3 days

  const questions = (data.questions || []).map((q) => {
    if (q.type === "fill") {
      return { type: "fill", text: q.questionText, acceptedAnswer: q.acceptedAnswer || "" };
    }
    const opts = q.options || {};
    return {
      type: "objective",
      text: q.questionText,
      options: LETTERS.map((l) => opts[l] || ""),
      correctIndex: LETTERS.indexOf((q.correctAnswer || "A").toUpperCase()),
    };
  });

  const duration = data.duration || 10;
  const scheduledStart = parseScheduleDateTime(data.scheduleDate, data.scheduleTime);
  // The quiz's live window closes "duration" minutes after its scheduled start.
  // Once that passes, anyone who hasn't completed it has missed it.
  const scheduledDeadline = scheduledStart
    ? new Date(scheduledStart.getTime() + duration * 60000)
    : null;

  return {
    id: docSnap.id,
    title: data.title || "Untitled Quiz",
    description: data.description || "",
    duration,
    scheduleDate: data.scheduleDate || null,
    scheduleTime: data.scheduleTime || null,
    scheduledStart,
    scheduledDeadline,
    image: data.image || quiz1,
    badge: isNew ? "New" : null,
    questions,
  };
}

/* ------------------------------------------------------------------ */
/*  Reusable bits                                                      */
/* ------------------------------------------------------------------ */

function BackButton({ onClick }) {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      className={`mb-4 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-colors hover:opacity-80 ${theme.border} ${theme.cardBg} ${theme.text}`}
      aria-label="Go back"
    >
      <ArrowLeft size={17} />
    </button>
  );
}

// A single 5-petal flower, drawn in plain SVG so we can recolor it per-instance.
function Flower({ size = 24, petalColor = "#0d9488", centerColor = "#fbbf24" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="20"
          cy="11"
          rx="6.5"
          ry="9.5"
          fill={petalColor}
          opacity="0.9"
          transform={`rotate(${angle} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="5.5" fill={centerColor} />
    </svg>
  );
}

// Flowers bloom in and drift down across the whole screen — the celebration
// animation shown on the congratulations screen after a quiz is submitted.
function FlowerBurst() {
  const palette = ["#0d9488", "#14b8a6", "#5eead4", "#f59e0b", "#fb923c", "#2dd4bf"];

  const flowers = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const startLeft = Math.random() * 100;
        return {
          id: i,
          startLeft,
          endLeft: Math.max(0, Math.min(100, startLeft + (Math.random() - 0.5) * 36)),
          size: 16 + Math.random() * 22,
          rotateStart: Math.random() * 360,
          rotateEnd: Math.random() * 540 - 270,
          delay: Math.random() * 1.1,
          duration: 3.4 + Math.random() * 2.4,
          petalColor: palette[i % palette.length],
        };
      }),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {flowers.map((f) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0, top: "-12%", left: `${f.startLeft}%`, rotate: f.rotateStart, scale: 0.3 }}
          animate={{
            opacity: [0, 1, 1, 0],
            top: "112%",
            left: `${f.endLeft}%`,
            rotate: f.rotateEnd,
            scale: 1,
          }}
          transition={{ duration: f.duration, delay: f.delay, ease: "easeIn" }}
          className="absolute"
        >
          <Flower size={f.size} petalColor={f.petalColor} />
        </motion.div>
      ))}
    </div>
  );
}

function Spinner() {
  const { theme } = useTheme();
  return (
    <div className="flex justify-center py-16">
      <Loader2 size={22} className={`animate-spin ${theme.verseNum}`} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const QuizPage = () => {
  const { theme, themeKey, fontSize } = useTheme();
  const currentUser = useCurrentUser();

  // A few small helpers so status-badges (Done/Missed/Upcoming) and their
  // matching buttons stay legible against a dark card too.
  const skeletonBg = themeKey === "dark" ? "bg-slate-700" : "bg-slate-200";
  const softCard = (light, dark) => (themeKey === "dark" ? dark : light);

  /* navigation: "list" | "taking" | "congrats" | "review" */
  const [view, setView] = useState("list");
  const [listTab, setListTab] = useState("active"); // "active" | "history"

  /* ---------------- live Firestore data ---------------- */
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [loadingActiveQuizzes, setLoadingActiveQuizzes] = useState(true);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Ticks periodically so scheduled start/deadline windows (and the "missed"
  // / "clear after 1 day" states derived from them) update live without a refresh.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  // Only the quiz the admin currently has posted shows up here — once they
  // post a new one, the previous quiz is archived server-side and drops out.
  useEffect(() => {
    const q = query(
      collection(db, "quizzes"),
      where("status", "==", "posted"),
      orderBy("postedAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setActiveQuizzes(snap.docs.map(mapDocToQuiz));
        setLoadingActiveQuizzes(false);
      },
      (err) => {
        console.error("Failed to load active quizzes:", err);
        setLoadingActiveQuizzes(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (currentUser.loading) return;
    if (!currentUser.uid) {
      setHistory([]);
      setLoadingHistory(false);
      return;
    }
    const q = query(
      collection(db, "quiz"),
      where("uid", "==", currentUser.uid),
      orderBy("completedAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingHistory(false);
      },
      (err) => {
        console.error("Failed to load quiz history:", err);
        setLoadingHistory(false);
      }
    );
    return () => unsub();
  }, [currentUser.uid, currentUser.loading]);

  // Every quiz id the user has already attempted — used to lock "Start Quiz" to "Done".
  const completedQuizIds = useMemo(
    () => new Set(history.map((h) => h.quizId).filter(Boolean)),
    [history]
  );

  // Derives per-quiz status (upcoming / missed / completed / clears from the
  // Active tab) from the raw posted quizzes + the user's completion history + now.
  const quizzesWithStatus = useMemo(() => {
    return activeQuizzes.map((quiz) => {
      const hasCompleted = completedQuizIds.has(quiz.id);
      const isUpcoming = quiz.scheduledStart ? now < quiz.scheduledStart.getTime() : false;
      const isExpired = quiz.scheduledDeadline ? now > quiz.scheduledDeadline.getTime() : false;
      const isMissed = isExpired && !hasCompleted;

      let hideFromActive = false;

      if (hasCompleted) {
        // Once completed, keep showing "Done" in the Active tab for 1 day,
        // then it clears — the result still lives on in "My History".
        const completedEntry = history.find((h) => h.quizId === quiz.id);
        const completedAt = completedEntry?.completedAt?.toDate
          ? completedEntry.completedAt.toDate().getTime()
          : completedEntry?.completedDate
          ? new Date(completedEntry.completedDate).getTime()
          : null;
        if (completedAt && now - completedAt > ONE_DAY_MS) hideFromActive = true;
      } else if (isMissed && quiz.scheduledDeadline) {
        // Same 1-day grace period for missed quizzes before they clear too.
        if (now - quiz.scheduledDeadline.getTime() > ONE_DAY_MS) hideFromActive = true;
      }

      return { ...quiz, hasCompleted, isUpcoming, isMissed, hideFromActive };
    });
  }, [activeQuizzes, completedQuizIds, history, now]);

  const visibleActiveQuizzes = useMemo(
    () => quizzesWithStatus.filter((q) => !q.hideFromActive),
    [quizzesWithStatus]
  );

  // Quizzes the user never attempted before their scheduled window closed —
  // synthesized as "Missed" rows for the History tab (no Firestore doc exists for these).
  const missedHistoryEntries = useMemo(() => {
    return quizzesWithStatus
      .filter((q) => q.isMissed)
      .map((q) => ({
        id: `missed-${q.id}`,
        quizId: q.id,
        quizTitle: q.title,
        status: "MISSED",
        scorePercent: null,
        isMissedEntry: true,
        completedAt: null,
        completedDate: q.scheduledDeadline ? formatDateTime(q.scheduledDeadline) : "",
        sortTime: q.scheduledDeadline ? q.scheduledDeadline.getTime() : 0,
      }));
  }, [quizzesWithStatus]);

  const combinedHistory = useMemo(() => {
    const real = history.map((h) => ({
      ...h,
      sortTime: h.completedAt?.toDate
        ? h.completedAt.toDate().getTime()
        : h.completedDate
        ? new Date(h.completedDate).getTime()
        : 0,
    }));
    return [...real, ...missedHistoryEntries].sort((a, b) => b.sortTime - a.sortTime);
  }, [history, missedHistoryEntries]);

  const [activeQuiz, setActiveQuizState] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // index (objective) or string (fill) per question
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [lastResult, setLastResult] = useState(null); // result object for congrats/review
  const [reviewSource, setReviewSource] = useState(null); // "live" | "history"

  const timerRef = useRef(null);

  /* ---------------- timer ---------------- */
  useEffect(() => {
    if (view !== "taking") {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitQuiz(); // auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((e) => e + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  /* ---------------- actions ---------------- */

  const handleStartQuiz = (quiz) => {
    if (completedQuizIds.has(quiz.id)) return; // already attempted — can't retake
    if (quiz.isMissed) return; // scheduled window has closed — missed it
    if (quiz.isUpcoming) return; // not open yet
    setActiveQuizState(quiz);
    setCurrentIndex(0);
    setAnswers(Array(quiz.questions.length).fill(null));
    setSecondsLeft(quiz.duration * 60);
    setElapsedSeconds(0);
    setView("taking");
  };

  const handleSelectOption = (optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  };

  const handleFillChange = (value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = value;
      return next;
    });
  };

  const isCurrentAnswered = () => {
    if (!activeQuiz) return false;
    const q = activeQuiz.questions[currentIndex];
    const a = answers[currentIndex];
    if (q.type === "fill") return typeof a === "string" && a.trim().length > 0;
    return a !== null && a !== undefined;
  };

  const handleNext = () => {
    if (currentIndex < activeQuiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmitQuiz = async () => {
    clearInterval(timerRef.current);
    if (!activeQuiz) return;

    const details = activeQuiz.questions.map((q, i) => {
      const selected = answers[i];
      let isCorrect = false;
      if (q.type === "fill") {
        isCorrect =
          typeof selected === "string" &&
          selected.trim().toLowerCase() === (q.acceptedAnswer || "").trim().toLowerCase();
      } else {
        isCorrect = selected === q.correctIndex;
      }
      return {
        type: q.type,
        text: q.text,
        options: q.options || null,
        acceptedAnswer: q.acceptedAnswer || null,
        selected: selected ?? null,
        correctIndex: q.correctIndex ?? null,
        isCorrect,
      };
    });

    const correctCount = details.filter((d) => d.isCorrect).length;
    const attemptedQuestions = details.filter(
      (d) => d.selected !== null && d.selected !== undefined && d.selected !== ""
    ).length;
    const total = details.length;
    const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const status = getResultStatus(scorePercent);
    const timeTakenSeconds = elapsedSeconds;
    const timeTakenLabel = `${Math.floor(elapsedSeconds / 60)}m ${String(elapsedSeconds % 60).padStart(2, "0")}s`;
    const rank = getRank(scorePercent);
    const completedDate = new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const resultPayload = {
      uid: currentUser.uid || null,
      candidateName: currentUser.name || "Anonymous",
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      totalQuestions: total,
      attemptedQuestions,
      correctCount,
      scorePercent,
      status,
      timeTakenSeconds,
      timeTakenLabel,
      rank,
      details,
    };

    // Show it in "My History" and flip the quiz card to "Done" immediately,
    // without waiting on the round trip to Firestore.
    const optimisticId = `optimistic-${Date.now()}`;
    setHistory((prev) => [{ id: optimisticId, completedDate, ...resultPayload }, ...prev]);

    const localResult = { id: optimisticId, completedDate, ...resultPayload };
    setLastResult(localResult);
    setReviewSource("live");
    setView("congrats");

    setSubmitting(true);
    try {
      if (currentUser.uid) {
        await addDoc(collection(db, "quiz"), {
          ...resultPayload,
          completedAt: serverTimestamp(),
        });
        // the live "quiz" listener will replace the optimistic entry above
        // with the real, server-confirmed document automatically.
      } else {
        console.warn("No logged-in user — quiz result was not saved to Firestore.");
      }
    } catch (err) {
      console.error("Failed to save quiz result:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const openReview = (result, source) => {
    if (result.isMissedEntry) return; // nothing to review for a missed quiz
    setLastResult(result);
    setReviewSource(source);
    setView("review");
  };

  const goToList = (tab) => {
    setActiveQuizState(null);
    if (tab) setListTab(tab);
    setView("list");
  };

  /* ------------------------------------------------------------------ */
  /*  Screens                                                            */
  /* ------------------------------------------------------------------ */

  const progressPct = activeQuiz
    ? Math.round(((currentIndex + 1) / activeQuiz.questions.length) * 100)
    : 0;

  return (
    <div className={`min-h-screen px-4 py-4 transition-colors sm:px-8 ${theme.pageBg}`}>
      <div className="mx-auto max-w-md">
        <AnimatePresence mode="wait">
          {/* ============================== LIST ============================== */}
          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className={`text-2xl font-bold ${theme.heading}`}>Bible Study Quizzes</h1>
              <p className={`mb-5 text-sm ${theme.subText}`}>Challenge your knowledge and grow in the Word.</p>

              <div className={`mb-5 flex items-center gap-6 border-b ${theme.border}`}>
                {[
                  { key: "active", label: "Active Quizzes" },
                  { key: "history", label: "My History" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setListTab(tab.key)}
                    className={`relative pb-3 text-sm font-semibold transition-colors ${
                      listTab === tab.key ? theme.verseNum : `${theme.subText} hover:opacity-80`
                    }`}
                  >
                    {tab.label}
                    {listTab === tab.key && (
                      <motion.span
                        layoutId="list-tab-underline"
                        className={`absolute -bottom-px left-0 right-0 h-[2px] ${theme.pillBg}`}
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {listTab === "active" ? (
                loadingActiveQuizzes ? (
                  <Spinner />
                ) : visibleActiveQuizzes.length === 0 ? (
                  <p className={`py-10 text-center text-sm ${theme.subText}`}>
                    No quizzes have been posted yet. Check back soon!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {visibleActiveQuizzes.map((quiz, i) => {
                      const isDone = quiz.hasCompleted;
                      const isMissed = quiz.isMissed;
                      const isUpcoming = quiz.isUpcoming;
                      const isLocked = isDone || isMissed || isUpcoming;

                      let buttonLabel = "Start Quiz";
                      if (isDone) buttonLabel = "Done";
                      else if (isMissed) buttonLabel = "Missed";
                      else if (isUpcoming) buttonLabel = "Not Yet Open";

                      return (
                        <motion.div
                          key={quiz.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className={`overflow-hidden rounded-2xl border shadow-sm ${theme.border} ${theme.cardBg}`}
                        >
                          <div className="relative h-36 w-full">
                            <img src={quiz1} alt={quiz.title} className="h-full w-full object-cover" />
                            {isDone && (
                              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                                <CheckCircle2 size={11} /> Completed
                              </span>
                            )}
                            {!isDone && isMissed && (
                              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                                <XCircle size={11} /> Missed
                              </span>
                            )}
                            {!isDone && !isMissed && isUpcoming && (
                              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                                <Calendar size={11} /> Upcoming
                              </span>
                            )}
                            {!isDone && !isMissed && !isUpcoming && quiz.badge && (
                              <span className="absolute right-3 top-3 rounded-full bg-teal-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                                {quiz.badge}
                              </span>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className={`mb-1.5 text-[15px] font-bold ${theme.text}`}>{quiz.title}</h3>
                            <div className={`mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] ${theme.subText}`}>
                              <span className="flex items-center gap-1">
                                <Clock size={13} /> {quiz.duration} mins
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen size={13} /> {quiz.questions.length} Questions
                              </span>
                              {quiz.scheduledStart && (
                                <span className="flex items-center gap-1">
                                  <Calendar size={13} /> {formatDateTime(quiz.scheduledStart)}
                                </span>
                              )}
                            </div>
                            <motion.button
                              whileTap={!isLocked ? { scale: 0.98 } : {}}
                              onClick={() => handleStartQuiz(quiz)}
                              disabled={isLocked || quiz.questions.length === 0}
                              className={`flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold shadow-sm transition-colors disabled:cursor-not-allowed ${
                                isDone
                                  ? softCard("bg-slate-100 text-slate-400", "bg-slate-800 text-slate-500")
                                  : isMissed
                                  ? softCard("bg-rose-50 text-rose-400", "bg-rose-950/40 text-rose-400")
                                  : isUpcoming
                                  ? softCard("bg-amber-50 text-amber-500", "bg-amber-950/30 text-amber-400")
                                  : "bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-50"
                              }`}
                            >
                              {isDone && <CheckCircle2 size={15} />}
                              {isMissed && <XCircle size={15} />}
                              {buttonLabel}
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )
              ) : loadingHistory ? (
                <Spinner />
              ) : (
                <div className="space-y-3">
                  {combinedHistory.length === 0 && (
                    <p className={`py-10 text-center text-sm ${theme.subText}`}>
                      You haven't completed any quizzes yet.
                    </p>
                  )}
                  {combinedHistory.map((h, i) => {
                    const isMissedEntry = !!h.isMissedEntry;
                    return (
                      <motion.div
                        key={h.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-3 rounded-2xl border p-4 shadow-sm ${theme.border} ${theme.cardBg}`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isMissedEntry
                              ? softCard("bg-rose-50 text-rose-500", "bg-rose-950/40 text-rose-400")
                              : softCard("bg-teal-50 text-teal-600", "bg-teal-900/40 text-teal-300")
                          }`}
                        >
                          {isMissedEntry ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-[14px] font-bold ${theme.text}`}>{h.quizTitle}</p>
                          <p className={`text-[12px] ${theme.subText}`}>
                            {isMissedEntry ? "Missed on " : "Completed on "}
                            {h.completedAt?.toDate
                              ? h.completedAt.toDate().toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : h.completedDate || ""}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          {isMissedEntry ? (
                            <p className="mb-1 text-[13px] font-semibold text-rose-500">Missed</p>
                          ) : (
                            <>
                              <p className={`mb-1 text-[13px] font-bold ${theme.text}`}>
                                {h.scorePercent}% <span className={`font-normal ${theme.subText}`}>Score</span>
                              </p>
                              <button
                                onClick={() => openReview(h, "history")}
                                className={`rounded-full border px-3 py-1 text-[11px] font-semibold hover:opacity-80 ${
                                  themeKey === "dark" ? "border-teal-500" : "border-teal-600"
                                } ${theme.verseNum}`}
                              >
                                View Review
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ============================== TAKING ============================== */}
          {view === "taking" && activeQuiz && (
            <motion.div
              key="taking"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <BackButton onClick={() => goToList("active")} />

              <div className={`mb-4 flex items-center justify-center gap-1.5 ${theme.verseNum}`}>
                <TimerIcon size={16} />
                <span className="text-sm font-bold">{formatClock(secondsLeft)}</span>
              </div>

              <div className="mb-1.5 flex items-center justify-between text-[12px] font-semibold">
                <span className={theme.subText}>
                  Question {currentIndex + 1} of {activeQuiz.questions.length}
                </span>
                <span className={theme.verseNum}>{progressPct}% Completed</span>
              </div>
              <div className={`mb-5 h-2 w-full overflow-hidden rounded-full ${skeletonBg}`}>
                <motion.div
                  className="h-full rounded-full bg-teal-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18 }}
                >
                  <h2 className={`mb-5 ${fontSize.bodyClass} text-lg font-bold leading-snug ${theme.text}`}>
                    {activeQuiz.questions[currentIndex].text}
                  </h2>

                  {activeQuiz.questions[currentIndex].type === "fill" ? (
                    <div className="mb-8">
                      <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3.5 shadow-sm focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 ${theme.border} ${theme.cardBg}`}>
                        <Pencil size={16} className="shrink-0 text-teal-600" />
                        <input
                          value={answers[currentIndex] || ""}
                          onChange={(e) => handleFillChange(e.target.value)}
                          placeholder="Type your answer..."
                          className={`w-full bg-transparent text-sm outline-none ${theme.text}`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8 space-y-3">
                      {activeQuiz.questions[currentIndex].options.map((opt, i) => {
                        const selected = answers[currentIndex] === i;
                        return (
                          <motion.button
                            key={i}
                            whileTap={{ scale: 0.985 }}
                            onClick={() => handleSelectOption(i)}
                            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left shadow-sm transition-colors ${theme.cardBg} ${
                              selected
                                ? "border-teal-600 ring-1 ring-teal-600"
                                : `${theme.border} hover:border-teal-400/50`
                            }`}
                          >
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold ${
                                selected ? "bg-teal-600 text-white" : softCard("bg-slate-100 text-slate-500", "bg-slate-800 text-slate-400")
                              }`}
                            >
                              {LETTERS[i]}
                            </span>
                            <span className={`${fontSize.bodyClass} font-medium ${theme.text}`}>{opt}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2">
                {currentIndex > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePrevious}
                    className={`flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold hover:opacity-80 ${theme.border} ${theme.cardBg} ${theme.text}`}
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </motion.button>
                )}

                {currentIndex < activeQuiz.questions.length - 1 ? (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    disabled={!isCurrentAnswered()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-800 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next Question
                    <ArrowRight size={16} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitQuiz}
                    disabled={!isCurrentAnswered() || submitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-800 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    {submitting ? "Submitting..." : "Submit Quiz"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* ============================== CONGRATS ============================== */}
          {view === "congrats" && lastResult && (
            <motion.div
              key="congrats"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <BackButton onClick={() => goToList("active")} />

              <FlowerBurst />

              <div className="relative flex flex-col items-center pt-2 text-center">
                <motion.div
                  initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border shadow-md ${theme.border} ${theme.cardBg}`}
                >
                  <Award size={34} className={theme.verseNum} />
                </motion.div>

                <h2 className={`text-2xl font-bold ${theme.heading}`}>
                  Congratulations{lastResult.candidateName ? `, ${lastResult.candidateName.split(" ")[0]}` : ""}!
                </h2>
                <p className={`mb-6 max-w-xs text-sm ${theme.subText}`}>
                  You've completed the {lastResult.quizTitle} challenge.
                </p>

                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className={`mb-6 flex h-28 w-28 flex-col items-center justify-center rounded-2xl border-[3px] border-teal-600 shadow-sm ${theme.cardBg}`}
                >
                  <span className={`text-3xl font-extrabold ${theme.verseNum}`}>{lastResult.scorePercent}%</span>
                  <span className={`text-[11px] font-semibold uppercase tracking-wide ${theme.subText}`}>Score</span>
                </motion.div>

                <div className="mb-6 w-full space-y-2.5">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openReview(lastResult, "live")}
                    className="w-full rounded-full bg-teal-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
                  >
                    Review Detailed Results
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToList("active")}
                    className={`w-full rounded-full border py-3 text-sm font-semibold hover:opacity-80 ${theme.border} ${theme.cardBg} ${theme.text}`}
                  >
                    Back to Dashboard
                  </motion.button>
                </div>

                <div className="w-full space-y-3">
                  <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm ${theme.border} ${theme.cardBg}`}>
                    <span className={`flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide ${theme.subText}`}>
                      <Clock size={14} className="text-teal-600" /> Time Taken
                    </span>
                    <span className={`text-sm font-bold ${theme.text}`}>{lastResult.timeTakenLabel}</span>
                  </div>
                  <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm ${theme.border} ${theme.cardBg}`}>
                    <span className={`flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide ${theme.subText}`}>
                      <CheckCircle2 size={14} className="text-teal-600" /> Correct
                    </span>
                    <span className={`text-sm font-bold ${theme.text}`}>
                      {lastResult.correctCount}/{lastResult.totalQuestions}
                    </span>
                  </div>
                  <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm ${theme.border} ${theme.cardBg}`}>
                    <span className={`flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide ${theme.subText}`}>
                      <Sparkles size={14} className="text-teal-600" /> Rank Up
                    </span>
                    <span className={`text-sm font-bold ${theme.text}`}>{lastResult.rank}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================== REVIEW ============================== */}
          {view === "review" && lastResult && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <BackButton
                onClick={() => (reviewSource === "live" ? setView("congrats") : goToList("history"))}
              />

              <h1 className={`text-xl font-bold ${theme.heading}`}>{lastResult.quizTitle}</h1>
              <p className={`mb-4 text-sm ${theme.subText}`}>
                Review your detailed quiz results and answers below.
              </p>

              <div className={`mb-5 flex items-center justify-between rounded-2xl px-4 py-3.5 ${softCard("bg-teal-50", "bg-teal-900/30")}`}>
                <span className={`text-[12px] font-semibold uppercase tracking-wide ${theme.verseNum}`}>Final Score</span>
                <span className={`text-xl font-extrabold ${theme.verseNum}`}>
                  {lastResult.scorePercent}%{" "}
                  <span className="text-sm font-medium opacity-80">
                    {lastResult.correctCount}/{lastResult.totalQuestions}
                  </span>
                </span>
              </div>

              <div className="mb-6 space-y-4">
                {lastResult.details.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`rounded-2xl border p-4 shadow-sm ${theme.border} ${theme.cardBg}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className={`text-[11px] font-bold uppercase tracking-wide ${theme.subText}`}>
                        Question {i + 1}
                      </span>
                      <span
                        className={`flex items-center gap-1 text-[11px] font-bold ${
                          d.isCorrect ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {d.isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {d.isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                    <p className={`mb-3 ${fontSize.bodyClass} font-semibold ${theme.text}`}>{d.text}</p>

                    {d.type === "fill" ? (
                      <div className="space-y-2">
                        <div
                          className={`flex items-center justify-between rounded-xl border px-3 py-2 text-[13px] font-medium ${
                            d.isCorrect
                              ? softCard("border-emerald-500 bg-emerald-50 text-emerald-700", "border-emerald-500 bg-emerald-950/30 text-emerald-400")
                              : softCard("border-rose-400 bg-rose-50 text-rose-600", "border-rose-500 bg-rose-950/30 text-rose-400")
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {d.isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            Your answer: {d.selected || "—"}
                          </span>
                        </div>
                        {!d.isCorrect && (
                          <div className={`flex items-center justify-between rounded-xl border px-3 py-2 text-[13px] font-medium ${softCard("border-emerald-500 bg-emerald-50 text-emerald-700", "border-emerald-500 bg-emerald-950/30 text-emerald-400")}`}>
                            <span className="flex items-center gap-2">
                              <CheckCircle2 size={14} />
                              Correct answer: {d.acceptedAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {d.options.map((opt, oi) => {
                          const isSelected = d.selected === oi;
                          const isAnswer = d.correctIndex === oi;
                          let style = `${theme.border} ${theme.subText}`;
                          if (isAnswer) style = softCard("border-emerald-500 bg-emerald-50 text-emerald-700", "border-emerald-500 bg-emerald-950/30 text-emerald-400");
                          else if (isSelected && !d.isCorrect) style = softCard("border-rose-400 bg-rose-50 text-rose-600", "border-rose-500 bg-rose-950/30 text-rose-400");

                          return (
                            <div
                              key={oi}
                              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-[13px] font-medium ${style}`}
                            >
                              <span className="flex items-center gap-2">
                                {isAnswer ? (
                                  <CheckCircle2 size={14} className="text-emerald-500" />
                                ) : isSelected ? (
                                  <XCircle size={14} className="text-rose-500" />
                                ) : (
                                  <span className={`h-3.5 w-3.5 rounded-full border ${theme.border}`} />
                                )}
                                {opt}
                              </span>
                              {isAnswer && (
                                <span className="text-[10px] font-bold uppercase text-emerald-500">
                                  Correct answer
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => goToList("history")}
                className="w-full rounded-full bg-teal-800 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-900"
              >
                Done
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPage;
