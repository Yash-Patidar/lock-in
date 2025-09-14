'use client';

import { useAtomValue } from 'jotai';
import { themeColorsAtom } from '@/store/themeAtoms';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SimplePixelBackground from './SimplePixelBackground';
import ErrorBoundary from './ErrorBoundary';

// Dynamically import the complex components with error handling
const Dither = dynamic(() => import('./Dither'), {
  ssr: false,
  loading: () => null
});

export default function DynamicBackground() {
  const themeColors = useAtomValue(themeColorsAtom);
  const [useSimpleBackground, setUseSimpleBackground] = useState(false);

  useEffect(() => {
    // Check if WebGL is supported
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setUseSimpleBackground(true);
      }
    } catch {
      console.log('WebGL check failed, using simple background');
      setUseSimpleBackground(true);
    }
  }, []);

  if (useSimpleBackground) {
    return (
      <SimplePixelBackground 
        pixelSize={6}
        colors={[themeColors.primary, themeColors.accent, themeColors.light, themeColors.dark]}
        speed={0.03}
        density={0.4}
      />
    );
  }

  return (
    <ErrorBoundary fallback={<SimplePixelBackground />}>
      <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
          pixelSize={2}
        />
      </div>
    </ErrorBoundary>
  );
}