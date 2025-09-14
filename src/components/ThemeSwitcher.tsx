'use client';

import { useState } from 'react';

export const themes = {
  cyan: {
    name: 'Cyan Focus',
    primary: '#06b6d4',
    accent: '#22d3ee',
    gradient: 'from-cyan-300 via-cyan-400 to-cyan-200',
    description: 'Modern, tech-focused, calming'
  },
  purple: {
    name: 'Cosmic Purple',
    primary: '#8b5cf6',
    accent: '#a78bfa', 
    gradient: 'from-purple-300 via-purple-400 to-purple-200',
    description: 'Creative, inspiring, premium'
  },
  emerald: {
    name: 'Matrix Green',
    primary: '#10b981',
    accent: '#34d399',
    gradient: 'from-emerald-300 via-emerald-400 to-emerald-200', 
    description: 'Growth, productivity, energy'
  },
  amber: {
    name: 'Sunset Orange',
    primary: '#f59e0b',
    accent: '#fbbf24',
    gradient: 'from-amber-300 via-amber-400 to-amber-200',
    description: 'Warm, motivating, energetic'
  },
  rose: {
    name: 'Rose Focus',
    primary: '#f43f5e',
    accent: '#fb7185',
    gradient: 'from-rose-300 via-rose-400 to-rose-200',
    description: 'Bold, passionate, intense'
  },
  indigo: {
    name: 'Deep Focus',
    primary: '#6366f1',
    accent: '#818cf8',
    gradient: 'from-indigo-300 via-indigo-400 to-indigo-200',
    description: 'Deep, contemplative, focused'
  }
};

import { ThemeKey } from '@/store/themeAtoms';

interface ThemeSwitcherProps {
  currentTheme: ThemeKey;
  onThemeChange: (theme: ThemeKey) => void;
}

export default function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-effect rounded-xl p-3 hover:scale-105 transition-all duration-200 border border-cyan-400/30"
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: themes[currentTheme as keyof typeof themes]?.primary }}
          />
          <span className="text-sm font-medium text-white">Theme</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 glass-effect rounded-xl p-4 min-w-[280px] border border-cyan-400/30 shadow-2xl">
          <h3 className="text-sm font-semibold text-white mb-3">Choose Theme</h3>
          <div className="space-y-2">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => {
                  onThemeChange(key as ThemeKey);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-white/5 ${
                  currentTheme === key ? 'bg-white/10 border border-cyan-400/30' : ''
                }`}
              >
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: theme.primary }}
                />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white">{theme.name}</div>
                  <div className="text-xs text-gray-400">{theme.description}</div>
                </div>
                {currentTheme === key && (
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}