import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Timer modes configuration
type TimerModeConfig = {
  name: string;
  duration: number;
  color: string;
  bgColor: string;
};

type TimerModes = {
  POMODORO: TimerModeConfig;
  SHORT_BREAK: TimerModeConfig;
  LONG_BREAK: TimerModeConfig;
};

export const TIMER_MODES: TimerModes = {
  POMODORO: { name: 'Focus', duration: 25 * 60, color: '#06b6d4', bgColor: 'bg-cyan-500' },
  SHORT_BREAK: { name: 'Short Break', duration: 5 * 60, color: '#22d3ee', bgColor: 'bg-cyan-400' },
  LONG_BREAK: { name: 'Long Break', duration: 15 * 60, color: '#0891b2', bgColor: 'bg-cyan-600' }
};

export type TimerMode = keyof typeof TIMER_MODES;

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  pomodoros: number;
}

export interface Settings {
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
}

// Atoms with localStorage persistence
export const tasksAtom = atomWithStorage<Task[]>('lockInTasks', [
  { id: 1, text: "Fruit only for snacks/treats", completed: false, pomodoros: 0 },
  { id: 2, text: "45 minutes workout", completed: false, pomodoros: 0 },
  { id: 3, text: "1 gallon of water", completed: false, pomodoros: 0 },
  { id: 4, text: "Progress picture", completed: false, pomodoros: 0 },
  { id: 5, text: "10 minutes reading", completed: false, pomodoros: 0 }
]);

export const heatmapDataAtom = atomWithStorage<Record<string, number>>('lockInHeatmap', {});
export const pomodoroCountAtom = atomWithStorage<number>('lockInPomodoroCount', 0);
export const settingsAtom = atomWithStorage<Settings>('lockInSettings', {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15
});

// Session atoms (not persisted)
export const currentModeAtom = atom<TimerMode>('POMODORO');
export const timeLeftAtom = atom<number>(TIMER_MODES.POMODORO.duration);
export const isActiveAtom = atom<boolean>(false);
export const activeTaskAtom = atom<Task | null>(null);
export const notificationAtom = atom<string>('');

// Derived atoms
export const completedTasksAtom = atom((get) => 
  get(tasksAtom).filter(task => task.completed)
);

export const totalTasksAtom = atom((get) => get(tasksAtom).length);

export const completionRateAtom = atom((get) => {
  const completed = get(completedTasksAtom).length;
  const total = get(totalTasksAtom);
  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

export const currentStreakAtom = atom((get) => {
  const heatmapData = get(heatmapDataAtom);
  const dates = Object.keys(heatmapData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  let streak = 0;
  for (const date of dates) {
    if (heatmapData[date] >= 3) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
});

export const activeDaysAtom = atom((get) => {
  const heatmapData = get(heatmapDataAtom);
  return Object.values(heatmapData).filter(level => level > 0).length;
});