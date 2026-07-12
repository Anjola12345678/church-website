// src/Components/AppearanceModal.jsx
//
// The old "gear icon" settings sheet from the Bible page, generalized so it
// can be opened from the top bar on every screen and drive the app-wide
// ThemeContext.

import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { FONT_SIZES, THEMES, useTheme } from '../Context/ThemeContext';

function ModalShell({ onClose, children, widthClass = 'max-w-sm' }) {
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

export default function AppearanceModal({ onClose }) {
  const { fontIndex, setFontIndex, themeKey, setThemeKey } = useTheme();

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <h2 className="flex items-center gap-2 text-[16px] font-bold text-[#0F3B39]">
          <SlidersHorizontal size={16} /> Appearance
        </h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-neutral-400">Text Size</p>
          <div className="grid grid-cols-4 gap-2">
            {FONT_SIZES.map((f, i) => (
              <button
                key={f.key}
                onClick={() => setFontIndex(i)}
                className={`flex h-11 items-center justify-center rounded-xl border text-[13px] font-bold transition-colors ${
                  fontIndex === i
                    ? 'border-[#0F3B39] bg-[#0F3B39] text-white'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-neutral-400">
            Theme — applies across the whole app
          </p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(THEMES).map(([key, t]) => {
              const Icon = t.icon;
              const active = themeKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setThemeKey(key)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[12px] font-semibold transition-colors ${
                    active ? 'border-[#0F3B39] ring-1 ring-[#0F3B39]' : 'border-neutral-200 hover:bg-neutral-50'
                  } ${t.pageBg} ${t.text}`}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
