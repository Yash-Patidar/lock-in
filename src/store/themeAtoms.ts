import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type ThemeKey = 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'indigo';

export const currentThemeAtom = atomWithStorage<ThemeKey>('lockInTheme', 'cyan');

export const themeColorsAtom = atom((get) => {
  const theme = get(currentThemeAtom);
  
  const themeMap = {
    cyan: {
      primary: '#06b6d4',
      accent: '#22d3ee',
      light: '#67e8f9',
      dark: '#0891b2',
      gradient: 'from-cyan-300 via-cyan-400 to-cyan-200',
      waveColor: [0.024, 0.714, 0.831] as [number, number, number],
      glowColor: 'rgba(6, 182, 212, 0.3)'
    },
    purple: {
      primary: '#8b5cf6',
      accent: '#a78bfa',
      light: '#c4b5fd',
      dark: '#7c3aed',
      gradient: 'from-purple-300 via-purple-400 to-purple-200',
      waveColor: [0.545, 0.361, 0.965] as [number, number, number],
      glowColor: 'rgba(139, 92, 246, 0.3)'
    },
    emerald: {
      primary: '#10b981',
      accent: '#34d399',
      light: '#6ee7b7',
      dark: '#059669',
      gradient: 'from-emerald-300 via-emerald-400 to-emerald-200',
      waveColor: [0.063, 0.725, 0.506] as [number, number, number],
      glowColor: 'rgba(16, 185, 129, 0.3)'
    },
    amber: {
      primary: '#f59e0b',
      accent: '#fbbf24',
      light: '#fcd34d',
      dark: '#d97706',
      gradient: 'from-amber-300 via-amber-400 to-amber-200',
      waveColor: [0.961, 0.620, 0.043] as [number, number, number],
      glowColor: 'rgba(245, 158, 11, 0.3)'
    },
    rose: {
      primary: '#f43f5e',
      accent: '#fb7185',
      light: '#fda4af',
      dark: '#e11d48',
      gradient: 'from-rose-300 via-rose-400 to-rose-200',
      waveColor: [0.957, 0.247, 0.369] as [number, number, number],
      glowColor: 'rgba(244, 63, 94, 0.3)'
    },
    indigo: {
      primary: '#6366f1',
      accent: '#818cf8',
      light: '#a5b4fc',
      dark: '#4f46e5',
      gradient: 'from-indigo-300 via-indigo-400 to-indigo-200',
      waveColor: [0.388, 0.400, 0.945] as [number, number, number],
      glowColor: 'rgba(99, 102, 241, 0.3)'
    }
  };
  
  return themeMap[theme];
});