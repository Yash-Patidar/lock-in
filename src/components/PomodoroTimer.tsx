'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useCallback } from 'react';
import { 
  currentModeAtom, 
  timeLeftAtom, 
  isActiveAtom, 
  activeTaskAtom, 
  pomodoroCountAtom,
  tasksAtom,
  TIMER_MODES,
  TimerMode,
  notificationAtom,
  heatmapDataAtom
} from '@/store/atoms';

export default function PomodoroTimer() {
  const [currentMode, setCurrentMode] = useAtom(currentModeAtom);
  const [timeLeft, setTimeLeft] = useAtom(timeLeftAtom);
  const [isActive, setIsActive] = useAtom(isActiveAtom);
  const [pomodoroCount, setPomodoroCount] = useAtom(pomodoroCountAtom);
  const [tasks, setTasks] = useAtom(tasksAtom);
  const activeTask = useAtomValue(activeTaskAtom);
  const setNotification = useSetAtom(notificationAtom);
  const setHeatmapData = useSetAtom(heatmapDataAtom);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateHeatmap = useCallback(() => {
    const today = new Date().toDateString();
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    
    if (totalTasks > 0) {
      const completionRate = completedTasks / totalTasks;
      let level = 0;
      if (completionRate >= 0.2) level = 1;
      if (completionRate >= 0.4) level = 2;
      if (completionRate >= 0.6) level = 3;
      if (completionRate >= 0.8) level = 4;
      if (completionRate === 1) level = 5;
      
      setHeatmapData(prev => ({ ...prev, [today]: level }));
    }
  }, [tasks, setHeatmapData]);

  const switchMode = useCallback((mode: TimerMode) => {
    setCurrentMode(mode);
    setIsActive(false);
    setTimeLeft(TIMER_MODES[mode].duration);
  }, [setCurrentMode, setIsActive, setTimeLeft]);

  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      console.log('Audio notification not available');
    }
  }, []);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    playNotificationSound();

    if (currentMode === 'POMODORO') {
      setPomodoroCount(prev => prev + 1);
      
      // Add pomodoro to active task
      if (activeTask) {
        setTasks(prev => prev.map(task => 
          task.id === activeTask.id 
            ? { ...task, pomodoros: (task.pomodoros || 0) + 1 }
            : task
        ));
      }

      setNotification('Pomodoro completed! Time for a break 🎉');
      
      // Auto switch to break
      const nextMode: TimerMode = pomodoroCount % 4 === 3 ? 'LONG_BREAK' : 'SHORT_BREAK';
      switchMode(nextMode);
    } else {
      setNotification('Break completed! Ready to focus? 🔥');
      switchMode('POMODORO');
    }

    updateHeatmap();
  }, [setIsActive, playNotificationSound, currentMode, setPomodoroCount, activeTask, setTasks, setNotification, pomodoroCount, switchMode, updateHeatmap]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, handleTimerComplete, setTimeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMER_MODES[currentMode].duration);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / TIMER_MODES[currentMode].duration);
  const circumference = 2 * Math.PI * 90;
  const strokeDasharray = `${progress * circumference} ${circumference}`;

  return (
    <div className="glass-effect rounded-2xl p-4 md:p-8">
      {/* Mode Switcher */}
      <div className="flex justify-center mb-6 space-x-2">
        {Object.entries(TIMER_MODES).map(([mode, config]) => (
          <button
            key={mode}
            onClick={() => switchMode(mode as TimerMode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentMode === mode 
                ? `${config.bgColor} text-white` 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {config.name}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center">
        <div className="relative mb-6 md:mb-8 mx-auto w-48 h-48 md:w-64 md:h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              fill="none" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="8"
            />
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              fill="none" 
              stroke={TIMER_MODES[currentMode].color} 
              strokeWidth="8" 
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              className="timer-ring transition-all duration-100"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl md:text-5xl font-mono font-bold mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wide">
              {TIMER_MODES[currentMode].name}
            </div>
          </div>
        </div>

        {/* Active Task Display */}
        {activeTask && (
          <div className="mb-6 p-4 glass-effect rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Working on:</div>
            <div className="font-medium">{activeTask.text}</div>
          </div>
        )}

        {/* Timer Controls */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={toggleTimer}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 md:px-8 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all"
          >
            <span>{isActive ? '⏸️' : '▶️'}</span>
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </button>
          <button 
            onClick={resetTimer}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl transition-all"
          >
            🔄
          </button>
        </div>

        {/* Pomodoro Counter */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-400 mb-2">Today&apos;s Pomodoros</div>
          <div className="text-2xl font-bold">{pomodoroCount} 🍅</div>
        </div>
      </div>
    </div>
  );
}