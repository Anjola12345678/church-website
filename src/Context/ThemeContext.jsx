// src/Context/ThemeContext.jsx
//
// App-wide appearance state (color theme + text size). Any page/component
// can read it with `useTheme()`. Persisted to localStorage so it survives
// refreshes and logins.

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon, Coffee } from 'lucide-react';

export const FONT_SIZES = [
  { key: 'sm', label: 'S', verseClass: 'text-lg md:text-xl', bodyClass: 'text-sm' },
  { key: 'md', label: 'M', verseClass: 'text-xl md:text-2xl', bodyClass: 'text-base' },
  { key: 'lg', label: 'L', verseClass: 'text-2xl md:text-3xl', bodyClass: 'text-lg' },
  { key: 'xl', label: 'XL', verseClass: 'text-3xl md:text-4xl', bodyClass: 'text-xl' },
];

export const THEMES = {
  light: {
    label: 'Light',
    icon: Sun,
    pageBg: 'bg-neutral-50',
    cardBg: 'bg-white',
    toolbarBg: 'bg-neutral-50/80',
    border: 'border-neutral-200',
    heading: 'text-[#0F3B39]',
    text: 'text-neutral-800',
    subText: 'text-neutral-400',
    verseNum: 'text-[#0F3B39]',
    pillBg: 'bg-[#0F3B39]',
    pillText: 'text-white',
    iconBtn: 'text-[#0F3B39] border-neutral-200 hover:bg-neutral-100',
    selectedVerseBg: 'bg-black/[0.04]',
  },
  sepia: {
    label: 'Sepia',
    icon: Coffee,
    pageBg: 'bg-[#F1E7D0]',
    cardBg: 'bg-[#FBF3E3]',
    toolbarBg: 'bg-[#F1E7D0]/80',
    border: 'border-[#e3d5b8]',
    heading: 'text-[#5b4636]',
    text: 'text-[#5b4636]',
    subText: 'text-[#a08a68]',
    verseNum: 'text-[#8a5a2f]',
    pillBg: 'bg-[#8a5a2f]',
    pillText: 'text-white',
    iconBtn: 'text-[#5b4636] border-[#e3d5b8] hover:bg-[#efe2c7]',
    selectedVerseBg: 'bg-[#8a5a2f]/[0.08]',
  },
  dark: {
    label: 'Dark',
    icon: Moon,
    pageBg: 'bg-slate-950',
    cardBg: 'bg-slate-900',
    toolbarBg: 'bg-slate-900/80',
    border: 'border-slate-800',
    heading: 'text-teal-300',
    text: 'text-slate-100',
    subText: 'text-slate-500',
    verseNum: 'text-teal-400',
    pillBg: 'bg-teal-600',
    pillText: 'text-white',
    iconBtn: 'text-slate-200 border-slate-700 hover:bg-slate-800',
    selectedVerseBg: 'bg-white/[0.06]',
  },
};

function loadPref(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? raw : fallback;
  } catch {
    return fallback;
  }
}

function savePref(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(() => loadPref('app-theme', 'light'));
  const [fontIndex, setFontIndex] = useState(() => {
    const idx = FONT_SIZES.findIndex((f) => f.key === loadPref('app-font-size', 'md'));
    return idx >= 0 ? idx : 1;
  });

  useEffect(() => savePref('app-theme', themeKey), [themeKey]);
  useEffect(() => savePref('app-font-size', FONT_SIZES[fontIndex].key), [fontIndex]);

  // Mirrors the theme onto <html> as a class too, so plain CSS (scrollbars,
  // native inputs, anything outside Tailwind-themed components) can react.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-light', 'theme-sepia', 'theme-dark');
    root.classList.add(`theme-${themeKey}`);
  }, [themeKey]);

  const theme = THEMES[themeKey] || THEMES.light;
  const fontSize = FONT_SIZES[fontIndex];

  const value = { themeKey, setThemeKey, theme, fontIndex, setFontIndex, fontSize };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a <ThemeProvider>');
  return ctx;
}
