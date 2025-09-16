'use client';

import { useState, useEffect } from 'react';
import { indexedDBService, type CompletedDay } from '@/lib/indexeddb';
import Image from 'next/image';

export default function TaskCalendar() {
  const [completedDays, setCompletedDays] = useState<CompletedDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<CompletedDay | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Load completed days from IndexedDB
  useEffect(() => {
    const loadCompletedDays = async () => {
      try {
        const days = await indexedDBService.getCompletedDays();
        setCompletedDays(days);
      } catch (error) {
        console.error('Error loading completed days:', error);
        setCompletedDays([]);
      }
    };

    loadCompletedDays();

    // Listen for new day completions
    const handleDayCompletion = () => {
      loadCompletedDays();
    };

    window.addEventListener('lock-in-day-completed', handleDayCompletion);
    return () => window.removeEventListener('lock-in-day-completed', handleDayCompletion);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getCompletionForDate = (date: Date): CompletedDay | null => {
    const dateString = date.toISOString().split('T')[0];
    return completedDays.find(day => day.date === dateString) || null;
  };

  const getDayColor = (completionRate: number | null): string => {
    if (completionRate === null) return 'bg-gray-800 border-gray-700';
    if (completionRate >= 90) return 'bg-green-500 border-green-400';
    if (completionRate >= 75) return 'bg-emerald-500 border-emerald-400';
    if (completionRate >= 60) return 'bg-yellow-500 border-yellow-400';
    if (completionRate >= 40) return 'bg-orange-500 border-orange-400';
    return 'bg-red-500 border-red-400';
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="glass-effect rounded-2xl p-4 md:p-6 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <span>📅</span>
              Task Calendar
              <span className="text-sm font-normal text-gray-400">({completedDays.length} days completed)</span>
            </h2>

            <div className="flex items-center gap-4">
              <button
                onClick={previousMonth}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 transition-colors"
              >
                ←
              </button>
              <h3 className="text-lg font-semibold text-cyan-300 min-w-[140px] text-center">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 transition-colors"
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {getDaysInMonth(currentMonth).map((date, index) => {
              if (!date) {
                return <div key={index} className="aspect-square" />;
              }

              const completion = getCompletionForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={date.toISOString()}
                  className={`aspect-square border rounded-lg cursor-pointer transition-all hover:scale-105 flex flex-col items-center justify-center relative ${
                    getDayColor(completion?.completionRate || null)
                  } ${isToday ? 'ring-2 ring-cyan-400' : ''}`}
                  onClick={() => completion && setSelectedDay(completion)}
                >
                  <span className="text-sm font-medium text-white">
                    {date.getDate()}
                  </span>
                  {completion && (
                    <>
                      <span className="text-xs text-white/80">
                        {completion.completionRate}%
                      </span>
                      {completion.image && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" title="Has photo" />
                      )}
                    </>
                  )}
                  {isToday && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-800 border border-gray-700 rounded-sm" />
              <span>No data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 border border-red-400 rounded-sm" />
              <span>0-40%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 border border-orange-400 rounded-sm" />
              <span>40-60%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 border border-yellow-400 rounded-sm" />
              <span>60-75%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 border border-emerald-400 rounded-sm" />
              <span>75-90%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 border border-green-400 rounded-sm" />
              <span>90-100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl shadow-cyan-500/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {new Date(selectedDay.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Completion Rate */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{
                  color: selectedDay.completionRate >= 80 ? '#10b981' :
                         selectedDay.completionRate >= 60 ? '#f59e0b' : '#ef4444'
                }}>
                  {selectedDay.completionRate}%
                </div>
                <div className="text-gray-400">Completion Rate</div>
              </div>

              {/* Achievement Photo */}
              {selectedDay.image && (
                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-3">Achievement Photo</h4>
                  <Image
                    src={selectedDay.image}
                    alt="Achievement"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg border border-gray-600"
                  />
                </div>
              )}

              {/* Task List */}
              <div>
                <h4 className="text-lg font-semibold text-cyan-300 mb-3">Tasks</h4>
                <div className="space-y-2">
                  {selectedDay.tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                      <span className={`text-lg ${task.completed ? '✅' : '❌'}`}>
                        {task.completed ? '✅' : '❌'}
                      </span>
                      <span className={`flex-1 ${task.completed ? 'text-green-300' : 'text-red-300'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}