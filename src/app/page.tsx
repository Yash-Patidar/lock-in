'use client';

import { Provider } from 'jotai';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import PomodoroTimer from '@/components/PomodoroTimer';
import TasksPanel from '@/components/TasksPanel';
import Heatmap from '@/components/Heatmap';
import Notification from '@/components/Notification';
import SettingsModal from '@/components/SettingsModal';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import TweetCard from '@/components/TweetCard';
import DynamicBackground from '@/components/DynamicBackground';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import BlobCursor from '@/components/BlobCursor';
import { useAtom, useAtomValue } from 'jotai';
import { currentThemeAtom, themeColorsAtom } from '@/store/themeAtoms';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showWelcomeTweet, setShowWelcomeTweet] = useState(true);
  const [currentTheme, setCurrentTheme] = useAtom(currentThemeAtom);
  const themeColors = useAtomValue(themeColorsAtom);

  useEffect(() => {
    // Show welcome tweet for 10 seconds
    const timer = setTimeout(() => {
      setShowWelcomeTweet(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch(e.key) {
        case ' ':
          e.preventDefault();
          // Timer toggle will be handled by the PomodoroTimer component
          break;
        case 's':
        case 'S':
          setIsSettingsOpen(true);
          break;
        case 'Escape':
          setShowWelcomeTweet(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Provider>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
          <DynamicBackground />
        </div>

        {/* Custom Cursor */}
        <BlobCursor 
          fillColor={themeColors.primary}
          trailCount={3}
          sizes={[30, 60, 40]}
          innerSizes={[10, 20, 15]}
          opacities={[0.9, 0.6, 0.3]}
          shadowColor={themeColors.glowColor}
          shadowBlur={20}
        />

        {/* Theme Switcher */}
        <ThemeSwitcher 
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
        />

        {/* Content */}
        <div className="relative z-10 text-white">
          {/* Welcome Tweet Modal */}
          {showWelcomeTweet && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="relative">
                <button
                  onClick={() => setShowWelcomeTweet(false)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center text-white z-10 transition-colors backdrop-blur-sm border border-gray-600"
                >
                  ✕
                </button>
                <TweetCard 
                  tweetUrl="https://x.com/rauchg/status/1966898262990114858"
                  className="animate-in fade-in zoom-in duration-500 shadow-2xl"
                />
              </div>
            </div>
          )}

          <Header />
          <StatsCards />
          
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-4 md:gap-8 mb-8">
            <PomodoroTimer />
            <TasksPanel />
          </div>
          
          <Heatmap />
          
          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="fixed bottom-4 md:bottom-6 right-4 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-cyan-500/90 hover:bg-cyan-400 backdrop-blur-sm border border-cyan-400/30 rounded-full flex items-center justify-center text-lg md:text-xl transition-all shadow-lg shadow-cyan-500/25 z-40 hover:scale-110"
          >
            ⚙️
          </button>
          
          <div className="hidden md:block">
            <KeyboardShortcuts />
          </div>
          <Notification />
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
          />
        </div>
      </div>
    </Provider>
  );
}
