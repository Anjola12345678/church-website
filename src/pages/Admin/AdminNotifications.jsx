import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Megaphone,
  HeartHandshake,
  GraduationCap,
  Calendar,
  Bell,
  Bold,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CATEGORIES = [
  { value: 'alert',       label: 'Alert',       icon: AlertTriangle,   accentBg: 'bg-rose-50',    accentFg: 'text-rose-600',    barColor: 'bg-rose-400' },
  { value: 'update',      label: 'Update',      icon: Megaphone,       accentBg: 'bg-sky-50',     accentFg: 'text-sky-600',     barColor: 'bg-sky-400' },
  { value: 'prayer',      label: 'Prayer',      icon: HeartHandshake,  accentBg: 'bg-amber-50',   accentFg: 'text-amber-600',   barColor: 'bg-amber-400' },
  { value: 'celebration', label: 'Celebration', icon: GraduationCap,   accentBg: 'bg-violet-50',  accentFg: 'text-violet-600',  barColor: 'bg-violet-400' },
  { value: 'event',       label: 'Event',       icon: Calendar,        accentBg: 'bg-orange-50',  accentFg: 'text-orange-600',  barColor: 'bg-orange-400' },
  { value: 'general',     label: 'General',     icon: Bell,            accentBg: 'bg-slate-100',  accentFg: 'text-slate-600',   barColor: 'bg-slate-300' },
];

const FieldLabel = ({ children }) => (
  <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
    {children}
  </label>
);

const TextInput = (props) => (
  <input
    {...props}
    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
  />
);

const Section = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
  >
    <h2 className="mb-4 text-[15px] font-bold text-slate-900">{title}</h2>
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
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-6 left-1/2 z-[100] flex min-w-[280px] -translate-x-1/2 items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-[13px] font-medium text-white shadow-2xl"
    >
      {isError ? <AlertCircle size={16} className="text-rose-500" /> : <CheckCircle2 size={16} className="text-emerald-500" />}
      <span className="flex-1">{toast.message}</span>
      <div className={`absolute bottom-0 left-0 h-1 w-full rounded-b-lg ${isError ? 'bg-rose-500' : 'bg-emerald-500'}`} />
    </motion.div>
  );
};

const emptyForm = () => ({
  title: '',
  category: 'update',
  body: '',
  highPriority: false,
  senderName: '',
  senderRole: '',
});

const AdminNotification = () => {
  const [form, setForm] = useState(emptyForm());
  const [status, setStatus] = useState('DRAFTING');
  const [savedAt, setSavedAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const bodyRef = useRef(null);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const wrapBold = () => {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    if (selectionStart === selectionEnd) return;
    const before = value.slice(0, selectionStart);
    const selected = value.slice(selectionStart, selectionEnd);
    const after = value.slice(selectionEnd);
    const next = `${before}**${selected}**${after}`;
    set('body', next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectionStart + 2, selectionEnd + 2);
    });
  };

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const buildPayload = (publishStatus) => {
    const category = CATEGORIES.find((c) => c.value === form.category) || CATEGORIES[0];
    return {
      title: form.title.trim(),
      body: form.body.trim(),
      category: category.value,
      badgeLabel: category.label,
      highPriority: form.highPriority,
      sender: {
        name: form.senderName.trim() || 'Church Admin',
        role: form.senderRole.trim() || 'Communications Team',
      },
      status: publishStatus,
      createdAt: serverTimestamp(),
    };
  };

  const submit = async (publishStatus, successMessage) => {
    if (!form.title.trim()) {
      showToast('error', 'Please add a notification title.');
      return;
    }
    if (!form.body.trim()) {
      showToast('error', 'Please write a message before posting.');
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'notifications'), buildPayload(publishStatus));
      setStatus(publishStatus);
      setSavedAt(now());
      showToast('success', successMessage);
      setForm({ ...emptyForm(), senderName: form.senderName, senderRole: form.senderRole });
    } catch (err) {
      console.error('Failed to save notification:', err);
      showToast('error', 'Something went wrong saving to Firestore. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = () => submit('PUBLISHED', 'Notification posted to the board.');
  const handleDraft = () => submit('DRAFT', 'Saved as draft.');

  const selectedCategory = CATEGORIES.find((c) => c.value === form.category) || CATEGORIES[0];
  const SelectedIcon = selectedCategory.icon;

  return (
    <div className="min-h-screen bg-[#F4F6F5] pb-28 font-sans">
      <AnimatePresence>
        {toast && <Toast toast={toast} />}
      </AnimatePresence>

      <div className="mx-auto max-w-md space-y-4 px-2 pt-5">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900">Post Notification</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Share announcements and updates with the congregation.
          </p>
        </div>

        <Section title="Notification Title">
          <TextInput
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Enter headline for the church"
          />
        </Section>

        <Section title="Category">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = form.category === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => set('category', c.value)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
                    active
                      ? 'border-teal-700 bg-teal-700 text-white'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={13} />
                  {c.label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className={`flex h-5 w-5 items-center justify-center rounded-md ${selectedCategory.accentBg} ${selectedCategory.accentFg}`}>
              <SelectedIcon size={11} />
            </span>
            This sets the icon, color, and badge shown on the notification.
          </p>
        </Section>

        <Section title="Message Body">
          <div className="mb-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={wrapBold}
              title="Bold selected text"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <Bold size={12} />
            </button>
            <span className="text-[10px] text-slate-400">
              Select text and click B to make it bold — e.g. <strong>8:00 AM</strong>
            </span>
          </div>
          <textarea
            ref={bodyRef}
            rows={6}
            value={form.body}
            onChange={(e) => set('body', e.target.value)}
            placeholder="Share the details of your announcement here..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </Section>

        <Section title="Priority">
          <button
            onClick={() => set('highPriority', !form.highPriority)}
            className="flex w-full items-center justify-between"
          >
            <div className="text-left">
              <p className="text-[13px] font-semibold text-slate-800">Mark as High Priority</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Shows a red "High Priority" tag on the notification.
              </p>
            </div>
            <span
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                form.highPriority ? 'bg-rose-500' : 'bg-slate-200'
              }`}
            >
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
                style={{ left: form.highPriority ? 22 : 2 }}
              />
            </span>
          </button>
        </Section>

        <Section title="Posted As">
          <div className="space-y-4">
            <div>
              <FieldLabel>Name</FieldLabel>
              <TextInput
                value={form.senderName}
                onChange={(e) => set('senderName', e.target.value)}
                placeholder="Pastor Samuel"
              />
            </div>
            <div>
              <FieldLabel>Role / Title</FieldLabel>
              <TextInput
                value={form.senderRole}
                onChange={(e) => set('senderRole', e.target.value)}
                placeholder="Lead Pastor, COP Main Branch"
              />
            </div>
          </div>
        </Section>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <h2 className="text-[15px] font-bold text-slate-900">Publishing</h2>
          <p className="mb-4 mt-1 text-[12px] text-slate-400">
            Publishing saves this notification to Firestore and shows it on every member's
            Notifications page instantly.
          </p>

          <div className="space-y-2.5">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePublish}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 py-3 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-teal-800 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Publish to Board
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleDraft}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-3 text-[14px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
              Save Draft
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

export default AdminNotification;