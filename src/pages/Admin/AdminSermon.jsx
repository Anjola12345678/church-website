import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info,
  Bookmark,
  AlignLeft,
  ListOrdered,
  Link2,
  MapPin,
  ChevronsRight,
  HeartHandshake,
  Plus,
  X,
  Trash2,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

const IMAGE_POOL = Array.from({ length: 30 }, (_, i) =>
  `https://picsum.photos/seed/sermon-${i + 1}/900/700`
);

const pickRandomImage = () =>
  IMAGE_POOL[Math.floor(Math.random() * IMAGE_POOL.length)];

/* ------------------------------------------------------------------ */
/*  Field-level building blocks — every one accepts an `error` prop    */
/*  so invalid fields get a red border and helper text.                */
/* ------------------------------------------------------------------ */

const FieldLabel = ({ children, required }) => (
  <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
    {children}
    {required && <span className="ml-0.5 text-rose-500">*</span>}
  </label>
);

const ErrorText = ({ message }) => {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-500">
      <AlertCircle size={11} /> {message}
    </p>
  );
};

const TextInput = ({ error, ...props }) => (
  <input
    {...props}
    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition focus:ring-1 ${
      error
        ? 'border-slate-300 focus:border-slate-200 focus:ring-slate-200'
        : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500'
    }`}
  />
);

const TextArea = ({ rows = 3, error, ...props }) => (
  <textarea
    rows={rows}
    {...props}
    className={`w-full resize-none rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition focus:ring-1 ${
      error
        ? 'border-slate-300 focus:border-slate-200 focus:ring-slate-200'
        : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500'
    }`}
  />
);

const SelectInput = ({ error, ...props }) => (
  <select
    {...props}
    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-slate-700 outline-none transition focus:ring-1 ${
      error
        ? 'border-slate-300 focus:border-slate-200 focus:ring-slate-200'
        : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500'
    }`}
  />
);

const Section = ({ icon: Icon, title, children, innerRef }) => (
  <motion.div
    ref={innerRef}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
  >
    <div className="mb-4 flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-teal-700">
        <Icon size={13} />
      </span>
      <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
    </div>
    {children}
  </motion.div>
);

const Toast = ({ toast }) => {
  if (!toast) return null;
  const isError = toast.type === 'error';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 min-w-[290px] max-w-[92vw] items-center gap-3 rounded-lg bg-white px-4 py-3 text-[13px] font-medium shadow-2xl"
    >
      {isError ? (
        <AlertCircle size={16} className="shrink-0 text-rose-500" />
      ) : (
        <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
      )}
      <span className="flex-1">{toast.message}</span>
      <div
        className={`absolute bottom-0 left-0 h-1 w-full rounded-b-lg ${
          isError ? 'bg-rose-500' : 'bg-emerald-500'
        }`}
      />
    </motion.div>
  );
};

let _pid = 0;
const blankPoint = () => ({
  id: `pt-${_pid++}`,
  title: '',
  scripture: '',
  explanation: '',
  illustration: '',
});

const emptyForm = () => ({
  sermonTitle: '',
  date: '',
  preacher: '',
  serviceType: 'Sunday Service',
  mainScripture: '',
  memoryVerse: '',
  introduction: '',
  mainPoints: [blankPoint()],
  conclusion: '',
  scriptures: [],
  lessons: [],
  prayers: ['', '', ''],
});

/* ------------------------------------------------------------------ */
/*  Validation — runs before a sermon is allowed to go live.           */
/*  Returns an { [key]: message } map; empty object = form is valid.   */
/* ------------------------------------------------------------------ */

const POINT_FIELD_LABELS = {
  title: 'point title',
  scripture: 'scripture reference',
  explanation: 'detailed explanation',
  illustration: 'illustration',
};

const validateForm = (form) => {
  const errors = {};

  if (!form.sermonTitle.trim()) errors.sermonTitle = 'Sermon title is required.';
  if (!form.date) errors.date = 'Please select the date of the sermon.';
  if (!form.preacher.trim()) errors.preacher = "Preacher's name is required.";
  if (!form.mainScripture.trim()) errors.mainScripture = 'Main scripture reference is required.';
  if (!form.memoryVerse.trim()) errors.memoryVerse = 'Memory verse is required.';
  if (!form.introduction.trim()) errors.introduction = 'Introduction is required.';

  form.mainPoints.forEach((pt, idx) => {
    Object.keys(POINT_FIELD_LABELS).forEach((field) => {
      if (!pt[field].trim()) {
        errors[`point-${pt.id}-${field}`] = `Main Point ${idx + 1}: ${POINT_FIELD_LABELS[field]} is required.`;
      }
    });
  });

  if (!form.conclusion.trim()) errors.conclusion = 'Conclusion is required.';
  if (form.scriptures.length === 0) errors.scriptures = 'Add at least one related scripture.';
  if (form.lessons.length === 0) errors.lessons = 'Add at least one key lesson.';
  if (!form.prayers[0]?.trim()) errors.prayer0 = 'Prayer point 1 is required.';
  if (!form.prayers[1]?.trim()) errors.prayer1 = 'Prayer point 2 is required.';

  return errors;
};

const AdminSermon = () => {
  const [form, setForm] = useState(emptyForm());
  const [scripInput, setScripInput] = useState('');
  const [lessonInput, setLessonInput] = useState('');

  const [status, setStatus] = useState('DRAFTING');
  const [savedAt, setSavedAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const topRef = useRef(null);

  /* ---- always land at the top of the page, never mid-scroll ---- */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3800);
  };

  const clearError = (key) =>
    setErrors((e) => {
      if (!(key in e)) return e;
      const copy = { ...e };
      delete copy[key];
      return copy;
    });

  const set = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    clearError(field);
  };

  /* ---- point helpers ---- */
  const updatePoint = (id, field, val) => {
    setForm((f) => ({
      ...f,
      mainPoints: f.mainPoints.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    }));
    clearError(`point-${id}-${field}`);
  };
  const addPoint = () =>
    setForm((f) => ({ ...f, mainPoints: [...f.mainPoints, blankPoint()] }));
  const removePoint = (id) =>
    setForm((f) => ({
      ...f,
      mainPoints: f.mainPoints.length > 1 ? f.mainPoints.filter((p) => p.id !== id) : f.mainPoints,
    }));

  /* ---- scripture helpers ---- */
  const addScripture = () => {
    const v = scripInput.trim();
    if (!v || form.scriptures.includes(v)) return;
    set('scriptures', [...form.scriptures, v]);
    setScripInput('');
  };
  const removeScripture = (s) =>
    set('scriptures', form.scriptures.filter((x) => x !== s));

  /* ---- lesson helpers ---- */
  const addLesson = () => {
    const v = lessonInput.trim();
    if (!v) return;
    set('lessons', [...form.lessons, v]);
    setLessonInput('');
  };
  const removeLesson = (text) =>
    set('lessons', form.lessons.filter((x) => x !== text));

  /* ---- prayer helpers ---- */
  const updatePrayer = (i, v) => {
    setForm((f) => ({ ...f, prayers: f.prayers.map((x, idx) => (idx === i ? v : x)) }));
    if (i === 0) clearError('prayer0');
    if (i === 1) clearError('prayer1');
  };
  const addPrayer = () => setForm((f) => ({ ...f, prayers: [...f.prayers, ''] }));

  /* ---- build the Firestore payload ---- */
  const buildPayload = (publishStatus) => ({
    title: form.sermonTitle.trim(),
    date: form.date,
    preacher: form.preacher.trim(),
    serviceType: form.serviceType,
    mainScripture: form.mainScripture.trim(),
    memoryVerse: form.memoryVerse.trim(),
    introduction: form.introduction.trim(),
    mainPoints: form.mainPoints.map(({ title, scripture, explanation, illustration }) => ({
      title: title.trim(),
      scripture: scripture.trim(),
      explanation: explanation.trim(),
      illustration: illustration.trim(),
    })),
    conclusion: form.conclusion.trim(),
    relatedScriptures: form.scriptures,
    keyLessons: form.lessons,
    prayerPoints: form.prayers.map((p) => p.trim()).filter(Boolean),
    image: pickRandomImage(),
    status: publishStatus,
    createdAt: serverTimestamp(),
  });

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


const now_submit = async (publishStatus, successMessage) => {
  setIsSubmitting(true);
  try {
    // 1. Save to Firebase
    await addDoc(collection(db, 'sermon'), buildPayload(publishStatus));

    // 2. Format the date for a professional look
    const formattedDate = new Date(form.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 3. Send notification if published
    if (publishStatus === 'PUBLISHED') {
      await emailjs.send(
        'service_jogxx28', 
        'template_s6pptb8', 
        {
          title: form.sermonTitle,
          preacher: form.preacher,
          date: formattedDate, // Now using the formatted string
          description: form.introduction,
          optional_link: 'https://your-church-app.com/view'
        }, 
        'uk3AiPwRQ59XIPpbX'
      );
    }

    // 4. Update UI and Clear Form
    setStatus(publishStatus);
    setSavedAt(now());
    showToast('success', successMessage);
    setForm(emptyForm());
    setScripInput('');
    setLessonInput('');
    setErrors({});
  } catch (err) {
    console.error('Failed to save or send notification:', err);
    showToast('error', 'Something went wrong. Try again.');
  } finally {
    setIsSubmitting(false);
  }
};
  

  /* ---- Publish requires every field in the form to be complete ---- */
  const handlePublish = () => {
    const foundErrors = validateForm(form);
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      const messages = Object.values(foundErrors);
      const extra = messages.length > 1 ? ` (${messages.length - 1} more issue${messages.length - 1 > 1 ? 's' : ''} below)` : '';
      showToast('error', `${messages[0]}${extra}`);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    now_submit('PUBLISHED', 'Sermon published — it’s now live for everyone.');
  };

  /* ---- Draft only needs a title, so unfinished work can still be saved ---- */
  const handleDraft = () => {
    if (!form.sermonTitle.trim()) {
      setErrors((e) => ({ ...e, sermonTitle: 'Sermon title is required.' }));
      showToast('error', 'Please add a sermon title before saving.');
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    now_submit('DRAFT', 'Saved as draft.');
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div className="min-h-screen bg-[#F4F6F5] pb-28 font-sans">
      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>

      {/* ── Page content ── */}
      <div ref={topRef} className="mx-auto max-w-md space-y-4 px-2 pt-5">

        {/* Page heading */}
        <div>
          <h1 className="text-[22px] font-bold text-slate-900">Post New Sermon</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Craft and share your spiritual messages with the congregation using our simplified editor.
          </p>
        </div>

        {/* ── 1. Basic Information ── */}
        <Section icon={Info} title="Basic Information">
          <div className="space-y-4">
            <div>
              <FieldLabel required>Sermon Title</FieldLabel>
              <TextInput
                value={form.sermonTitle}
                onChange={(e) => set('sermonTitle', e.target.value)}
                placeholder="The Power of Faith"
                error={!!errors.sermonTitle}
              />
              <ErrorText message={errors.sermonTitle} />
            </div>
            <div>
              <FieldLabel required>Date of Sermon</FieldLabel>
              <TextInput
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                error={!!errors.date}
              />
              <ErrorText message={errors.date} />
            </div>
            <div>
              <FieldLabel required>Preacher's Name</FieldLabel>
              <TextInput
                value={form.preacher}
                onChange={(e) => set('preacher', e.target.value)}
                placeholder="Pastor John Doe"
                error={!!errors.preacher}
              />
              <ErrorText message={errors.preacher} />
            </div>
            <div>
              <FieldLabel required>Service Type</FieldLabel>
              <SelectInput value={form.serviceType} onChange={(e) => set('serviceType', e.target.value)}>
                {['Sunday Service', 'Midweek Service', 'Youth Service', 'Special Program'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </SelectInput>
            </div>
            <div>
              <FieldLabel required>Main Scripture Reference</FieldLabel>
              <TextInput
                value={form.mainScripture}
                onChange={(e) => set('mainScripture', e.target.value)}
                placeholder="e.g. John 3:16-17"
                error={!!errors.mainScripture}
              />
              <ErrorText message={errors.mainScripture} />
            </div>
          </div>
        </Section>

        {/* ── 2. Memory Verse ── */}
        <Section icon={Bookmark} title="Memory Verse">
          <FieldLabel required>Memory Verse Text</FieldLabel>
          <TextArea
            rows={2}
            value={form.memoryVerse}
            onChange={(e) => set('memoryVerse', e.target.value)}
            placeholder="For God so loved the world..."
            error={!!errors.memoryVerse}
          />
          <ErrorText message={errors.memoryVerse} />
        </Section>

        {/* ── 3. Introduction ── */}
        <Section icon={AlignLeft} title="Introduction">
          <FieldLabel required>Introduction Text</FieldLabel>
          <TextArea
            rows={3}
            value={form.introduction}
            onChange={(e) => set('introduction', e.target.value)}
            placeholder="Set the context for your message..."
            error={!!errors.introduction}
          />
          <ErrorText message={errors.introduction} />
        </Section>

        {/* ── 4. Main Points ── */}
        <Section icon={ListOrdered} title="Main Points">
          <div className="space-y-5">
            <AnimatePresence initial={false}>
              {form.mainPoints.map((pt, idx) => (
                <motion.div
                  key={pt.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-teal-700">
                      Point {idx + 1}
                    </span>
                    {form.mainPoints.length > 1 && (
                      <button
                        onClick={() => removePoint(pt.id)}
                        className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <FieldLabel required>Point Title</FieldLabel>
                      <TextInput
                        value={pt.title}
                        onChange={(e) => updatePoint(pt.id, 'title', e.target.value)}
                        placeholder="Point Title"
                        error={!!errors[`point-${pt.id}-title`]}
                      />
                      <ErrorText message={errors[`point-${pt.id}-title`]} />
                    </div>
                    <div>
                      <FieldLabel required>Scripture Reference</FieldLabel>
                      <TextInput
                        value={pt.scripture}
                        onChange={(e) => updatePoint(pt.id, 'scripture', e.target.value)}
                        placeholder="Scripture Reference"
                        error={!!errors[`point-${pt.id}-scripture`]}
                      />
                      <ErrorText message={errors[`point-${pt.id}-scripture`]} />
                    </div>
                    <div>
                      <FieldLabel required>Detailed Explanation</FieldLabel>
                      <TextArea
                        rows={2}
                        value={pt.explanation}
                        onChange={(e) => updatePoint(pt.id, 'explanation', e.target.value)}
                        placeholder="Detailed explanation..."
                        error={!!errors[`point-${pt.id}-explanation`]}
                      />
                      <ErrorText message={errors[`point-${pt.id}-explanation`]} />
                    </div>
                    <div>
                      <FieldLabel required>Illustration</FieldLabel>
                      <TextArea
                        rows={2}
                        value={pt.illustration}
                        onChange={(e) => updatePoint(pt.id, 'illustration', e.target.value)}
                        placeholder="Supporting story or analogy..."
                        error={!!errors[`point-${pt.id}-illustration`]}
                      />
                      <ErrorText message={errors[`point-${pt.id}-illustration`]} />
                    </div>
                  </div>
                  {idx < form.mainPoints.length - 1 && (
                    <div className="mt-5 border-b border-slate-100" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={addPoint}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-teal-700 hover:text-teal-800"
            >
              <Plus size={15} />
              Add Main Point
            </button>
          </div>
        </Section>

        {/* ── 5. Related Scriptures ── */}
        <Section icon={Link2} title="Related Scriptures">
          <FieldLabel required>Add at least one related scripture</FieldLabel>
          <div className="flex items-center gap-2">
            <TextInput
              value={scripInput}
              onChange={(e) => setScripInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addScripture())}
              placeholder="e.g. Psalm 23:1"
              error={!!errors.scriptures}
            />
            <button
              onClick={addScripture}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white hover:bg-teal-800"
            >
              <Plus size={16} />
            </button>
          </div>
          <ErrorText message={errors.scriptures} />

          {form.scriptures.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.scriptures.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-[12px] font-medium text-teal-700"
                >
                  {s}
                  <button
                    onClick={() => removeScripture(s)}
                    className="text-teal-400 hover:text-teal-700"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* ── 6. Key Lessons ── */}
        <Section icon={MapPin} title="Key Lessons">
          <FieldLabel required>Add at least one key lesson</FieldLabel>
          <div className="flex items-center gap-2">
            <TextInput
              value={lessonInput}
              onChange={(e) => setLessonInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLesson())}
              placeholder="Key takeaway..."
              error={!!errors.lessons}
            />
            <button
              onClick={addLesson}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white hover:bg-teal-800"
            >
              <Plus size={16} />
            </button>
          </div>
          <ErrorText message={errors.lessons} />

          {form.lessons.length > 0 && (
            <div className="mt-3 space-y-2.5">
              {form.lessons.map((lesson) => (
                <div key={lesson} className="group flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                  <span className="flex-1 text-[13px] text-slate-700">{lesson}</span>
                  <button
                    onClick={() => removeLesson(lesson)}
                    className="opacity-0 text-slate-300 hover:text-rose-500 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* ── 7. Conclusion ── */}
        <Section icon={ChevronsRight} title="Conclusion">
          <FieldLabel required>Final Thoughts and Application</FieldLabel>
          <TextArea
            rows={3}
            value={form.conclusion}
            onChange={(e) => set('conclusion', e.target.value)}
            placeholder="Wrap up your message..."
            error={!!errors.conclusion}
          />
          <ErrorText message={errors.conclusion} />
        </Section>

        {/* ── 8. Prayer Points ── */}
        <Section icon={HeartHandshake} title="Prayer Points">
          <div className="space-y-2.5">
            {form.prayers.map((val, i) => (
              <div key={i}>
                <TextInput
                  value={val}
                  onChange={(e) => updatePrayer(i, e.target.value)}
                  placeholder={`Prayer point ${i + 1}${i >= 2 ? ' (Optional)' : ' *'}`}
                  error={i === 0 ? !!errors.prayer0 : i === 1 ? !!errors.prayer1 : false}
                />
                {i === 0 && <ErrorText message={errors.prayer0} />}
                {i === 1 && <ErrorText message={errors.prayer1} />}
              </div>
            ))}
          </div>
          <button
            onClick={addPrayer}
            className="mt-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-teal-700 hover:text-teal-800"
          >
            <Plus size={13} /> Add More
          </button>
        </Section>

        {/* ── 9. Publishing ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <h2 className="text-[15px] font-bold text-slate-900">Publishing</h2>
          <p className="mb-4 mt-1 text-[12px] text-slate-400">
            Every field marked <span className="text-rose-500">*</span> must be filled in before a
            sermon can be published. Publishing saves this sermon to Firestore and makes it visible
            to every member instantly.
          </p>

          {errorCount > 0 && (
            <div className="mb-4 rounded-xl border border-gray-50 bg-rose-50 p-3">
              <p className="flex items-center gap-1.5 text-[12px] font-bold text-rose-600">
                <AlertCircle size={13} /> {errorCount} field{errorCount > 1 ? 's' : ''} need attention
              </p>
              <ul className="mt-1.5 list-inside list-disc space-y-0.5">
                {Object.values(errors).map((msg, i) => (
                  <li key={i} className="text-[11px] text-rose-500">
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2.5">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePublish}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 py-3 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-teal-800 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Publish Sermon
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleDraft}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-3 text-[14px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
              Save as Draft
            </motion.button>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Status</span>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                status === 'PUBLISHED'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              {status}
            </span>
          </div>
          {savedAt && (
            <p className="mt-1 text-[11px] italic text-slate-400">Last saved: {savedAt}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSermon;





// https://hook.eu1.make.com/7niv4jyighjumv0jes0ktcbcpsgh2vd1