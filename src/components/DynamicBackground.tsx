'use client';

import { useAtomValue } from 'jotai';
import { currentThemeAtom } from '@/store/themeAtoms';
import Lightning from './Lightning';

export default function DynamicBackground() {
  const currentTheme = useAtomValue(currentThemeAtom);

  // Convert theme to hue values for Lightning component
  const getThemeHue = () => {
    switch (currentTheme) {
      case 'cyan':
        return 190; // Cyan
      case 'purple':
        return 270; // Purple
      case 'emerald':
        return 160; // Emerald green
      case 'amber':
        return 45;  // Amber/orange
      case 'rose':
        return 350; // Rose/pink
      case 'indigo':
        return 240; // Indigo
      default:
        return 190; // Default cyan
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Lightning
        hue={getThemeHue()}
        xOffset={0}
        speed={0.5}
        intensity={0.8}
        size={1.2}
      />
    </div>
  );
}