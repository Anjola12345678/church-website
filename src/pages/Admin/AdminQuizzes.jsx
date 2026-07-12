import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronDown,
  Pencil,
  Trash2,
  ListChecks,
  Save,
  Send,
  CheckCircle2,
  AlignLeft,
  MoreVertical,
  TrendingUp,
  Download,
  ArrowUpDown,
  X,
  Image as ImageIcon,
  Loader2,
    AlertCircle,
} from "lucide-react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase/config";

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const LETTERS = ["A", "B", "C", "D"];

const EMPTY_QUESTION = {
  type: "objective", // "objective" | "fill"
  questionText: "",
  options: { A: "", B: "", C: "", D: "" },
  correctAnswer: "",
  acceptedAnswer: "",
};

// Status thresholds applied to every saved quiz result (also used on the user side)
const STATUS_STYLES = {
  EXCELLENT: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  GOOD: "bg-sky-50 text-sky-600 ring-sky-200",
  AVERAGE: "bg-rose-50 text-rose-600 ring-rose-200",
  PASSED: "bg-teal-50 text-teal-700 ring-teal-200",
};

const AVATAR_COLORS = ["#0d9488", "#0ea5a4", "#14b8a6", "#0f766e", "#115e59"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getResultStatus(scorePercent) {
  if (scorePercent >= 90) return "EXCELLENT";
  if (scorePercent >= 80) return "GOOD";
  if (scorePercent >= 60) return "PASSED";
  return "AVERAGE";
}

function formatTime(totalSeconds = 0) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dateLabel(d) {
  const today = startOfDay(new Date());
  const day = startOfDay(d);
  const diffDays = Math.round((today - day) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
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
          "Admin";
        setUser({ uid: firebaseUser.uid, name, loading: false });
      } catch (err) {
        console.error("Failed to load admin profile:", err);
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email || "Admin",
          loading: false,
        });
      }
    });
    return () => unsub();
  }, []);

  return user;
}

/* ------------------------------------------------------------------ */
/*  Small shared UI bits                                              */
/* ------------------------------------------------------------------ */

function FieldLabel({ children }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-slate-600">
      {children}
    </label>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Initials({ name, color }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}



function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed bottom-6 left-1/2 z-50 flex min-w-[280px] -translate-x-1/2 items-center gap-3 rounded-lg bg-slate-900 px-4 py-5 text-[13px] font-medium text-white shadow-2xl"
    >
      {/* Icon */}
      {isError ? (
        <AlertCircle size={16} className="text-rose-500" />
      ) : (
        <CheckCircle2 size={16} className="text-emerald-500" />
      )}

      {/* Message */}
      <span className="flex-1">{toast.message}</span>

      {/* Colored Bottom Indicator */}
      <div 
        className={`absolute bottom-0 left-0 h-1 w-full rounded-b-lg ${
          isError ? "bg-rose-500" : "bg-emerald-500"
        }`} 
      />
    </motion.div>
  );
}


const AdminQuizzes = () => {
  const currentUser = useCurrentUser();

  /* ---------------- top-level tab ---------------- */
  const [activeTab, setActiveTab] = useState("set"); // "set" | "results"

  /* ---------------- quiz configuration ---------------- */
  const [quizTitle, setQuizTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  /* ---------------- quiz creator / questions ---------------- */
  const [maxQuestions] = useState(30);
  const [questions, setQuestions] = useState([]);
  const [draft, setDraft] = useState(EMPTY_QUESTION);
  const [editingIndex, setEditingIndex] = useState(null); // null = adding new
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [errors, setErrors] = useState({});

  /* ---------------- quiz settings ---------------- */
  const [description, setDescription] = useState("");

  /* ---------------- results tab ---------------- */
  const [sortBy, setSortBy] = useState("Highest Score");
  const [sortOpen, setSortOpen] = useState(false);

  /* ---------------- posting state ---------------- */
  const [posting, setPosting] = useState(false);
  const [toast, setToast] = useState(null);

  /* ---------------- live Firestore data ---------------- */
  // "quizzes" — quiz definitions the admin has posted, read by the user-side quiz page.
  const [postedQuizzes, setPostedQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  // "quiz" — one document per candidate attempt (name, score, date, answers...).
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "quizzes"), orderBy("postedAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPostedQuizzes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingQuizzes(false);
      },
      (err) => {
        console.error("Failed to load quizzes:", err);
        setLoadingQuizzes(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "quiz"), orderBy("completedAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingResults(false);
      },
      (err) => {
        console.error("Failed to load quiz results:", err);
        setLoadingResults(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const progressPct = useMemo(
    () => Math.min(100, Math.round((questions.length / maxQuestions) * 100)),
    [questions.length, maxQuestions]
  );

  /* ---------------- question-builder helpers ---------------- */

  const updateOption = (letter, value) =>
    setDraft((d) => ({ ...d, options: { ...d.options, [letter]: value } }));

  const resetDraft = () => {
    setDraft(EMPTY_QUESTION);
    setEditingIndex(null);
    setErrors({});
  };

  const validateDraft = () => {
    const e = {};
    if (!draft.questionText.trim()) e.questionText = "Question text is required.";

    if (draft.type === "objective") {
      LETTERS.forEach((l) => {
        if (!draft.options[l].trim()) e[`option${l}`] = "Required";
      });
      if (!LETTERS.includes(draft.correctAnswer.toUpperCase())) {
        e.correctAnswer = "Enter A, B, C or D";
      }
    } else {
      if (!draft.acceptedAnswer.trim()) e.acceptedAnswer = "Accepted answer is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveQuestion = () => {
    if (!validateDraft()) return;

    const cleaned = {
      ...draft,
      correctAnswer: draft.correctAnswer.toUpperCase(),
    };

    if (editingIndex !== null) {
      setQuestions((qs) => qs.map((q, i) => (i === editingIndex ? cleaned : q)));
    } else {
      if (questions.length >= maxQuestions) return;
      setQuestions((qs) => [...qs, cleaned]);
    }
    resetDraft();
  };

  const handleEditQuestion = (index) => {
    setDraft(questions[index]);
    setEditingIndex(index);
    setErrors({});
    setShowQuestionList(false);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions((qs) => qs.filter((_, i) => i !== index)); // numbers re-arrange automatically
    if (editingIndex === index) resetDraft();
  };

  /* ---------------- post quiz -> Firestore ---------------- */

  // const handlePostQuiz = async () => {
  //   if (!quizTitle.trim()) {
  //     setToast({ type: "error", message: "Please give the quiz a title." });
  //     return;
  //   }
  //   if (questions.length === 0) {
  //     setToast({ type: "error", message: "Add at least one question before posting the quiz." });
  //     return;
  //   }
  //   if (!duration) {
  //     setToast({ type: "error", message: "Please set a quiz duration." });
  //     return;
  //   }

  //   setPosting(true);
  //   try {
  //     await addDoc(collection(db, "quizzes"), {
  //       title: quizTitle.trim(),
  //       description: description.trim(),
  //       scheduleDate,
  //       scheduleTime,
  //       duration: Number(duration),
  //       maxQuestions,
  //       questions,
  //       status: "posted",
  //       createdBy: { uid: currentUser.uid, name: currentUser.name },
  //       postedAt: serverTimestamp(),
  //     });

  //     setToast({ type: "success", message: `"${quizTitle}" was posted successfully.` });

  //     // reset the creator so the admin can start the next quiz
  //     setQuizTitle("");
  //     setDuration("");
  //     setScheduleDate("");
  //     setScheduleTime("");
  //     setDescription("");
  //     setQuestions([]);
  //     resetDraft();
  //   } catch (err) {
  //     console.error("Failed to post quiz:", err);
  //     setToast({ type: "error", message: "Couldn't post the quiz. Please try again." });
  //   } finally {
  //     setPosting(false);
  //   }
  // };



  const handlePostQuiz = async () => {
    if (!quizTitle.trim()) {
      setToast({ type: "error", message: "Please give the quiz a title." });
      return;
    }
    if (questions.length === 0) {
      setToast({ type: "error", message: "Add at least one question before posting the quiz." });
      return;
    }

    setPosting(true);
    try {
      // 1. Save to Firestore
      const quizData = {
        title: quizTitle.trim(),
        description: description.trim(),
        scheduleDate,
        scheduleTime,
        duration: Number(duration),
        maxQuestions,
        questions,
        status: "posted",
        createdBy: { uid: currentUser.uid, name: currentUser.name },
        postedAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, "quizzes"), quizData);

      // 2. Fetch all members and send emails
      const membersSnapshot = await getDocs(collection(db, "users"));
      membersSnapshot.forEach((doc) => {
        const memberData = doc.data();
        if (memberData.email) {
          sendQuizEmail(quizData, memberData.email);
        }
      });

      setToast({ type: "success", message: `"${quizTitle}" was posted and emails sent.` });

      // Reset form
      setQuizTitle("");
      setDuration("");
      setScheduleDate("");
      setScheduleTime("");
      setDescription("");
      setQuestions([]);
      resetDraft();
    } catch (err) {
      console.error("Failed to post quiz:", err);
      setToast({ type: "error", message: "Couldn't post the quiz." });
    } finally {
      setPosting(false);
    }
  };

  /* ---------------- results: group + sort live data ---------------- */

  const groupedResults = useMemo(() => {
    const groups = {};
    results.forEach((r) => {
      const completedAt = r.completedAt?.toDate ? r.completedAt.toDate() : new Date();
      const label = dateLabel(completedAt);
      const key = `${r.quizTitle}__${label}`;
      if (!groups[key]) {
        groups[key] = { group: r.quizTitle, when: label, rows: [], sortDate: completedAt };
      }
      groups[key].rows.push(r);
    });

    return Object.values(groups)
      .sort((a, b) => b.sortDate - a.sortDate)
      .map((g) => {
        const rows = [...g.rows];
        if (sortBy === "Highest Score") rows.sort((a, b) => b.scorePercent - a.scorePercent);
        if (sortBy === "Lowest Score") rows.sort((a, b) => a.scorePercent - b.scorePercent);
        if (sortBy === "Fastest Time")
          rows.sort((a, b) => (a.timeTakenSeconds || 0) - (b.timeTakenSeconds || 0));
        return { ...g, participants: rows.length, rows };
      });
  }, [results, sortBy]);

  const mostRecentQuiz = postedQuizzes[0] || null;
  const mostRecentParticipants = mostRecentQuiz
    ? results.filter((r) => r.quizId === mostRecentQuiz.id).length
    : 0;

  const weeklyCompletionRate = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = results.filter((r) => {
      const d = r.completedAt?.toDate ? r.completedAt.toDate() : null;
      return d && d.getTime() >= weekAgo;
    });
    if (recent.length === 0) return null;
    const passed = recent.filter((r) => r.status !== "AVERAGE").length;
    return Math.round((passed / recent.length) * 100);
  }, [results]);

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */



  const sendQuizEmail = async (quizData, memberEmail) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": import.meta.env.VITE_SENDINBLUE_API_KEY  
  },
body: JSON.stringify({
  sender: { name: "Chapel of Praise", email: "anjolaoluwaakintunde2@gmail.com" },
  to: [{ email: memberEmail }],
  subject: `New Quiz: ${quizData.title}`, // <--- THIS IS THE FIX
  templateId: 1,
  params: {
  QUIZ_TITLE: quizData.title,          // Matches "title": "latest update"
  QUIZ_DATE: quizData.scheduleDate,    // Matches "scheduleDate": "2026-07-10"
  QUIZ_DURATION: quizData.duration     // Matches "duration": 20
}
})
  });
  
  if (response.ok) {
    console.log("Email sent successfully!");
  } else {
    console.error("Failed to send email");
  }
};



  return (
    <div className="min-h-screen bg-slate-50 px-1 py-2 sm:px-8">
      <Toast toast={toast} />
      <div className="mx-auto max-w-2xl">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#0F3B39]">Quiz Management</h1>
          <p className="text-gray-600 mt-1">
            Create new assessments, manage question banks, and track candidate performance.
          </p>
        </div>

        {/* ---------------- Tabs ---------------- */}
        <div className="mb-6 flex items-center gap-6 border-b border-slate-200">
          {[
            { key: "set", label: "Set Quiz" },
            { key: "results", label: "See Results" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-3 text-sm font-semibold transition-colors ${
                activeTab === tab.key ? "text-teal-700" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute -bottom-px left-0 right-0 h-[2px] bg-teal-700"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "set" ? (
            <motion.div
              key="set"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* ---------------- Quiz Configuration ---------------- */}
              <Card>
                <h2 className="mb-4 text-base font-bold text-teal-700">Quiz Configuration</h2>

                <div className="mb-4">
                  <FieldLabel>Quiz Title</FieldLabel>
                  <input
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g., New Testament Basics"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="mb-4">
                  <FieldLabel>Quiz Schedule & Time</FieldLabel>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
                    <Calendar size={16} className="shrink-0 text-teal-600" />
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-700 outline-none"
                    />
                    <span className="text-slate-300">|</span>
                    <Clock size={16} className="shrink-0 text-teal-600" />
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Quiz Duration (Minutes)</FieldLabel>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
                    <Clock size={16} className="shrink-0 text-teal-600" />
                    <input
                      type="number"
                      min={1}
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="30"
                      className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                  </div>
                  <p className="mt-1.5 text-[12px] text-slate-400">
                    The quiz will automatically stop for users once this time elapses.
                  </p>
                </div>
              </Card>

              {/* ---------------- Quiz Creator ---------------- */}
              <Card>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">Quiz Creator</h2>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-teal-700">
                    DRAFT
                  </span>
                </div>

                {/* progress */}
                <div className="mb-4">
                  <div className="mb-1.5 flex items-center justify-between text-[12px] font-medium">
                    <span className="text-slate-500">Quiz Progress</span>
                    <span className="text-slate-400">
                      Question {Math.min(questions.length + 1, maxQuestions)} of {maxQuestions}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full bg-teal-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    />
                  </div>

                  {/* dropdown of added questions */}
                  <button
                    onClick={() => setShowQuestionList((s) => !s)}
                    disabled={questions.length === 0}
                    className="mt-3 flex w-full items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2 text-[13px] font-medium text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
                  >
                    <span>
                      {questions.length === 0
                        ? "No questions added yet"
                        : `View added questions (${questions.length})`}
                    </span>
                    <motion.span animate={{ rotate: showQuestionList ? 180 : 0 }}>
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {showQuestionList && questions.length > 0 && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="mt-2 overflow-hidden rounded-xl border border-slate-100"
                      >
                        {questions.map((q, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between gap-2 border-b border-slate-100 px-3.5 py-2.5 last:border-b-0"
                          >
                            <button
                              onClick={() => handleEditQuestion(i)}
                              className="flex min-w-0 flex-1 items-center gap-2 text-left"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[11px] font-semibold text-teal-700">
                                {i + 1}
                              </span>
                              <span className="truncate text-[13px] text-slate-600">
                                {q.questionText || "Untitled question"}
                              </span>
                              <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase text-slate-500">
                                {q.type === "objective" ? "MCQ" : "Fill"}
                              </span>
                            </button>
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                onClick={() => handleEditQuestion(i)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-teal-50 hover:text-teal-600"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(i)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                                title="Clear"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* question type toggle */}
                <div className="mb-4">
                  <FieldLabel>Question Type</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDraft((d) => ({ ...d, type: "objective" }))}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                        draft.type === "objective"
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <CheckCircle2 size={15} />
                      Objective
                    </button>
                    <button
                      onClick={() => setDraft((d) => ({ ...d, type: "fill" }))}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                        draft.type === "fill"
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Pencil size={15} />
                      Fill in the Blank
                    </button>
                  </div>
                </div>

                {/* question text */}
                <div className="mb-4">
                  <FieldLabel>Question Text</FieldLabel>
                  <textarea
                    value={draft.questionText}
                    onChange={(e) => setDraft((d) => ({ ...d, questionText: e.target.value }))}
                    placeholder="Enter your scriptural question here..."
                    rows={2}
                    className={`w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-1 ${
                      errors.questionText
                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-300"
                        : "border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                    }`}
                  />
                  {errors.questionText && (
                    <p className="mt-1 text-[12px] text-rose-500">{errors.questionText}</p>
                  )}
                </div>

                {/* ---------- type-specific body ---------- */}
                <AnimatePresence mode="wait">
                  {draft.type === "objective" ? (
                    <motion.div
                      key="objective"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <FieldLabel>Multiple Choice Options</FieldLabel>
                      <div className="mb-4 space-y-2.5">
                        {LETTERS.map((letter) => (
                          <div key={letter} className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[13px] font-bold text-teal-700">
                              {letter}
                            </span>
                            <input
                              value={draft.options[letter]}
                              onChange={(e) => updateOption(letter, e.target.value)}
                              placeholder={`Option ${letter} text`}
                              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-1 ${
                                errors[`option${letter}`]
                                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-300"
                                  : "border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                              }`}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mb-4">
                        <FieldLabel>Correct Answer Letter</FieldLabel>
                        <div className="flex items-center gap-3">
                          <input
                            value={draft.correctAnswer}
                            onChange={(e) =>
                              setDraft((d) => ({
                                ...d,
                                correctAnswer: e.target.value.slice(0, 1).toUpperCase(),
                              }))
                            }
                            maxLength={1}
                            className={`h-10 w-10 rounded-xl border text-center text-sm font-bold text-teal-700 outline-none focus:ring-1 ${
                              errors.correctAnswer
                                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-300"
                                : "border-teal-200 bg-teal-50 focus:border-teal-500 focus:ring-teal-500"
                            }`}
                          />
                          <span className="text-[12px] text-slate-400">
                            {errors.correctAnswer || "Enter A, B, C or D"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="fill"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="mb-4"
                    >
                      <FieldLabel>Blank Answer Mapping</FieldLabel>
                      <div className="mb-2.5 flex items-start gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-[12px] text-slate-500">
                        <AlignLeft size={14} className="mt-0.5 shrink-0 text-slate-400" />
                        <span>
                          Tip: Use <code className="rounded bg-white px-1 py-0.5 text-teal-600">{"{blank}"}</code>{" "}
                          in the text for blanks.
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 focus-within:ring-1 ${
                          errors.acceptedAnswer
                            ? "border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-300"
                            : "border-slate-200 focus-within:border-teal-500 focus-within:ring-teal-500"
                        }`}
                      >
                        <Pencil size={15} className="shrink-0 text-teal-600" />
                        <input
                          value={draft.acceptedAnswer}
                          onChange={(e) => setDraft((d) => ({ ...d, acceptedAnswer: e.target.value }))}
                          placeholder="Accepted Answer (e.g. Damascus)"
                          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                        />
                      </div>
                      {errors.acceptedAnswer && (
                        <p className="mt-1 text-[12px] text-rose-500">{errors.acceptedAnswer}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* total questions */}
                <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5">
                  <span className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
                    <ListChecks size={15} className="text-teal-600" />
                    Total Questions
                  </span>
                  <span className="text-[13px] font-bold text-slate-700">
                    {String(questions.length).padStart(2, "0")} / {maxQuestions}
                  </span>
                </div>

                <div className="flex gap-2">
                  {editingIndex !== null && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={resetDraft}
                      className="flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveQuestion}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-800"
                  >
                    <Save size={16} />
                    {editingIndex !== null ? "Update Question" : "Save Question"}
                  </motion.button>
                </div>
              </Card>

              {/* ---------------- Quiz Settings ---------------- */}
              <Card>
                <h2 className="mb-4 text-base font-bold text-slate-900">Quiz Settings</h2>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of the quiz content..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </Card>

              {/* ---------------- Recent Quizzes ---------------- */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">Recent Quizzes</h2>
                  <button className="text-[13px] font-semibold text-teal-700 hover:underline">
                    View All
                  </button>
                </div>

                {loadingQuizzes ? (
                  <Card className="mb-3 flex items-center justify-center py-6">
                    <Loader2 size={18} className="animate-spin text-teal-600" />
                  </Card>
                ) : mostRecentQuiz ? (
                  <Card className="mb-3 flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                      <ImageIcon size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {mostRecentQuiz.title}
                      </p>
                      <p className="text-[12px] text-slate-400">
                        {(mostRecentQuiz.questions || []).length} Qs · {mostRecentParticipants} Joined
                      </p>
                    </div>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50">
                      <MoreVertical size={16} />
                    </button>
                  </Card>
                ) : (
                  <Card className="mb-3 text-center text-[13px] text-slate-400">
                    No quizzes posted yet.
                  </Card>
                )}

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 p-5 text-white">
                  <TrendingUp className="absolute right-4 top-4 text-teal-300/40" size={36} />
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-200">
                    Recent Week
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {weeklyCompletionRate !== null ? `${weeklyCompletionRate}%` : "—"}
                  </p>
                  <p className="text-[12px] text-teal-200">Completion Rate</p>
                </div>
              </div>

              {/* ---------------- Post Quiz ---------------- */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePostQuiz}
                disabled={posting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {posting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {posting ? "Posting..." : "Post Quiz"}
              </motion.button>
            </motion.div>
          ) : (
            /* ================= SEE RESULTS TAB ================= */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <Card>
                <h2 className="text-base font-bold text-teal-700">Quiz Results</h2>
                <p className="mb-4 text-[12px] text-slate-400">
                  Real-time performance tracking across all posted quizzes
                </p>

                <div className="relative mb-4 inline-block">
                  <button
                    onClick={() => setSortOpen((s) => !s)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 px-3.5 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <ArrowUpDown size={13} className="text-teal-600" />
                    Sort By: <span className="font-semibold text-slate-800">{sortBy}</span>
                    <ChevronDown size={13} />
                  </button>
                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute z-10 mt-1 w-44 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg"
                      >
                        {["Highest Score", "Lowest Score", "Fastest Time"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setSortBy(opt);
                              setSortOpen(false);
                            }}
                            className={`block w-full px-3.5 py-2 text-left text-[12px] hover:bg-slate-50 ${
                              sortBy === opt ? "font-semibold text-teal-700" : "text-slate-600"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* table header */}
                <div className="mb-1 grid grid-cols-[1.6fr_1fr_1fr_0.8fr_1fr] gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <span>Candidate Name</span>
                  <span>Attempted Qs</span>
                  <span>Time Taken</span>
                  <span>Score</span>
                  <span>Status</span>
                </div>

                {loadingResults ? (
                  <div className="flex justify-center py-10">
                    <Loader2 size={20} className="animate-spin text-teal-600" />
                  </div>
                ) : groupedResults.length === 0 ? (
                  <div className="py-10 text-center text-[13px] text-slate-400">
                    No quiz attempts yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupedResults.map((group, gi) => (
                      <div key={gi}>
                        <div className="mb-2 rounded-lg bg-teal-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-teal-700">
                          {group.group} · {group.when} · {group.participants} participants
                        </div>
                        <div className="divide-y divide-slate-100">
                          {group.rows.map((r, i) => (
                            <motion.div
                              key={r.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.04 }}
                              className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr_1fr] items-center gap-2 px-1 py-2.5"
                            >
                              <span className="flex items-center gap-2 truncate text-[13px] font-medium text-slate-700">
                                <Initials
                                  name={r.candidateName}
                                  color={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                                />
                                <span className="truncate">{r.candidateName || "Anonymous"}</span>
                              </span>
                              <span className="text-[13px] text-slate-500">
                                {r.attemptedQuestions}/{r.totalQuestions}
                              </span>
                              <span className="text-[13px] text-slate-500">
                                {formatTime(r.timeTakenSeconds)}
                              </span>
                              <span className="text-[13px] font-bold text-slate-800">
                                {r.scorePercent}%
                              </span>
                              <span>
                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ring-1 ring-inset ${STATUS_STYLES[r.status]}`}
                                >
                                  {r.status}
                                </span>
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <motion.button
                whileTap={{ scale: 0.98 }}
                className="mx-auto flex items-center justify-center gap-2 rounded-full border border-teal-600 px-5 py-2.5 text-[13px] font-semibold text-teal-700 hover:bg-teal-50"
              >
                <Download size={15} />
                Export Detailed CSV Report
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminQuizzes;

