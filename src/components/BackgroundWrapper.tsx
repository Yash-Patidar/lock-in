'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SimplePixelBackground from './SimplePixelBackground';
import ErrorBoundary from './ErrorBoundary';

// Dynamically import the complex components with error handling
const Dither = dynamic(() => import('./Dither'), {
  ssr: false,
  loading: () => null
});

const PixelTrail = dynamic(() => import('./PixelTrail').catch(() => ({ default: () => null })), {
  ssr: false,
  loading: () => null
});

export default function BackgroundWrapper() {
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
        colors={['#06b6d4', '#22d3ee', '#0891b2', '#67e8f9']}
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
      <PixelTrail 
        gridSize={60}
        trailSize={0.15}
        maxAge={300}
        interpolate={8}
        color="#22d3ee"
        gooeyFilter={{
          id: "pixel-goo",
          strength: 15
        }}
      />
    </ErrorBoundary>
  );
}