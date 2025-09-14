'use client';

import { useAtomValue } from 'jotai';
import { themeColorsAtom } from '@/store/themeAtoms';

export default function Header() {
  const themeColors = useAtomValue(themeColorsAtom);

  return (
    <div className="text-center pt-6 md:pt-8 pb-6 px-4 relative">
      <div 
        className="absolute inset-0 bg-gradient-to-b via-transparent to-transparent blur-3xl"
        style={{ 
          background: `linear-gradient(to bottom, ${themeColors.primary}10, transparent, transparent)`
        }}
      ></div>
      
      {/* Badge-style container for LOCK-IN MODE */}
      <div className="relative inline-flex items-center justify-center mb-4">
        <div 
          className="glass-effect-dark rounded-2xl px-6 py-3 border-2 shadow-2xl"
          style={{ 
            borderColor: `${themeColors.accent}30`,
            boxShadow: `0 25px 50px -12px ${themeColors.primary}20`
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full animate-pulse shadow-lg"
              style={{ 
                backgroundColor: themeColors.accent,
                boxShadow: `0 0 10px ${themeColors.accent}50`
              }}
            ></div>
            <h1 
              className={`text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent tracking-tight`}
            >
              LOCK-IN MODE
            </h1>
            <div 
              className="w-3 h-3 rounded-full animate-pulse shadow-lg"
              style={{ 
                backgroundColor: themeColors.accent,
                boxShadow: `0 0 10px ${themeColors.accent}50`
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <p className="relative text-white/80 text-base md:text-lg font-medium">
        Final Quarter Push • Pomodoro Powered
      </p>
      <div 
        className="relative mt-4 w-24 h-1 bg-gradient-to-r from-transparent to-transparent mx-auto rounded-full"
        style={{
          background: `linear-gradient(to right, transparent, ${themeColors.accent}, transparent)`
        }}
      ></div>
    </div>
  );
}