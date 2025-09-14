'use client';

import { useAtomValue } from 'jotai';
import { themeColorsAtom } from '@/store/themeAtoms';

export default function DynamicBackground() {
  const themeColors = useAtomValue(themeColorsAtom);

  return (
    <div
      className="w-full h-full absolute top-0 left-0"
      style={{
        background: `linear-gradient(135deg,
          #0a0a0a 0%,
          #1a1a1a 25%,
          rgba(${hexToRgb(themeColors.primary)}, 0.03) 50%,
          #1a1a1a 75%,
          #0a0a0a 100%)`
      }}
    />
  );
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }
  return '6, 182, 212'; // fallback cyan
}