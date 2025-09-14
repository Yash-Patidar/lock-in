'use client';

import { useAtomValue } from 'jotai';
import { themeColorsAtom } from '@/store/themeAtoms';
import SimplePixelBackground from './SimplePixelBackground';

export default function DynamicBackground() {
  const themeColors = useAtomValue(themeColorsAtom);

  return (
    <SimplePixelBackground 
      pixelSize={6}
      colors={[themeColors.primary, themeColors.accent, themeColors.light, themeColors.dark]}
      speed={0.03}
      density={0.4}
    />
  );
}