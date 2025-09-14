'use client';

// Enhanced color palette for Lock-In Mode
export const colorTheme = {
  // Primary colors
  primary: {
    50: '#ecfeff',
    100: '#cffafe', 
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4', // Main cyan
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  
  // Background colors
  background: {
    primary: '#0f172a',    // Slate 950
    secondary: '#1e293b',  // Slate 800
    tertiary: '#334155',   // Slate 600
    glass: 'rgba(15, 23, 42, 0.4)',
    glassBorder: 'rgba(6, 182, 212, 0.25)',
  },
  
  // Status colors
  status: {
    success: '#10b981',   // Emerald 500
    warning: '#f59e0b',   // Amber 500
    error: '#ef4444',     // Red 500
    info: '#3b82f6',      // Blue 500
  },
  
  // Text colors
  text: {
    primary: '#f8fafc',     // Slate 50
    secondary: '#cbd5e1',   // Slate 300
    muted: '#94a3b8',       // Slate 400
    accent: '#22d3ee',      // Cyan 400
  }
};

// Alternative color schemes you could try
export const alternativeThemes = {
  // Purple/Violet theme
  cosmic: {
    primary: '#8b5cf6',     // Violet 500
    accent: '#a78bfa',      // Violet 400
    background: '#1e1b4b',  // Indigo 900
    text: '#e0e7ff',        // Indigo 100
  },
  
  // Green/Emerald theme  
  matrix: {
    primary: '#10b981',     // Emerald 500
    accent: '#34d399',      // Emerald 400
    background: '#064e3b',  // Emerald 900
    text: '#d1fae5',        // Emerald 100
  },
  
  // Orange/Amber theme
  sunset: {
    primary: '#f59e0b',     // Amber 500
    accent: '#fbbf24',      // Amber 400
    background: '#451a03',  // Amber 900
    text: '#fef3c7',        // Amber 100
  },
  
  // Blue/Sky theme
  ocean: {
    primary: '#0ea5e9',     // Sky 500
    accent: '#38bdf8',      // Sky 400
    background: '#0c4a6e',  // Sky 900
    text: '#e0f2fe',        // Sky 100
  }
};

export default function EnhancedTheme() {
  return null; // This is just a theme configuration file
}