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
            className="glass-effect rounded-2xl p-4 md:p-6 text-center group cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

            {/* Icon */}
            <div className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
              {stat.icon}
            </div>

            {/* Value */}
            <div className={`text-xl md:text-3xl font-bold text-white group-hover:text-gray-100 transition-colors duration-300 mb-1`}>
              {stat.value}
            </div>

            {/* Label */}
            <div className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium">
              {stat.label}
            </div>

            {/* Subtle bottom border glow */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
}