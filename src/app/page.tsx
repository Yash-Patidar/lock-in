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
import TweetCard from '@/components/TweetCard';
import DynamicBackground from '@/components/DynamicBackground';
import BlobCursor from '@/components/BlobCursor';
import SocialLinks from '@/components/SocialLinks';
import DayCompletion from '@/components/DayCompletion';
import TaskCalendar from '@/components/TaskCalendar';
import { useAtomValue } from 'jotai';
import { themeColorsAtom } from '@/store/themeAtoms';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showWelcomeTweet, setShowWelcomeTweet] = useState(false);
  const themeColors = useAtomValue(themeColorsAtom);

  useEffect(() => {
    // Check if user has seen welcome tweet before
    const hasSeenWelcome = localStorage.getItem('lock-in-welcome-seen');

    if (!hasSeenWelcome) {
      setShowWelcomeTweet(true);

      // Show welcome tweet for 8 seconds
      const timer = setTimeout(() => {
        setShowWelcomeTweet(false);
        localStorage.setItem('lock-in-welcome-seen', 'true');
      }, 8000);

      return () => clearTimeout(timer);
    }
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
          localStorage.setItem('lock-in-welcome-seen', 'true');
          break;
        case 't':
        case 'T':
          // Focus on task input for quick task adding
          const taskInput = document.querySelector('input[placeholder*="Add a new task"]') as HTMLInputElement;
          if (taskInput) {
            taskInput.focus();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Provider>
      <div className="min-h-screen bg-gray-950 relative overflow-hidden">
        {/* Simple Dark Background */}
        <div className="fixed inset-0">
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

        {/* Social Links */}
        <SocialLinks />

        {/* Content */}
        <div className="relative z-10 text-white">
          {/* Welcome Tweet Modal */}
          {showWelcomeTweet && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowWelcomeTweet(false);
                    localStorage.setItem('lock-in-welcome-seen', 'true');
                  }}
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

          <DayCompletion />
          <TaskCalendar />

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
