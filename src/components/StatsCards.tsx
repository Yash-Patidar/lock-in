'use client';

import { useAtomValue } from 'jotai';
import { 
  currentStreakAtom, 
  activeDaysAtom, 
  completionRateAtom, 
  completedTasksAtom, 
  pomodoroCountAtom 
} from '@/store/atoms';

export default function StatsCards() {
  const currentStreak = useAtomValue(currentStreakAtom);
  const activeDays = useAtomValue(activeDaysAtom);
  const completionRate = useAtomValue(completionRateAtom);
  const completedTasks = useAtomValue(completedTasksAtom);
  const totalPomodoros = useAtomValue(pomodoroCountAtom);

  const stats = [
    { icon: '🔥', value: currentStreak, label: 'Streak', color: 'text-cyan-400' },
    { icon: '📅', value: activeDays, label: 'Active Days', color: 'text-cyan-300' },
    { icon: '📈', value: `${completionRate}%`, label: 'Completion', color: 'text-cyan-500' },
    { icon: '🎯', value: completedTasks.length, label: 'Tasks Done', color: 'text-cyan-600' },
    { icon: '🍅', value: totalPomodoros, label: 'Pomodoros', color: 'text-cyan-400' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass-effect rounded-xl p-3 md:p-4 text-center group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 border border-cyan-500/10 hover:border-cyan-500/30 relative"
          >
            <div className="text-xl md:text-2xl mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className={`text-lg md:text-2xl font-bold ${stat.color} group-hover:text-cyan-300 transition-colors duration-300`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              {stat.label}
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
}