'use client';

import { useAtomValue } from 'jotai';
import { themeColorsAtom } from '@/store/themeAtoms';

export default function Header() {
  const themeColors = useAtomValue(themeColorsAtom);

  return (
    <div className="text-center pt-20 pb-6 px-4 relative">
      <div
        className="absolute inset-0 bg-gradient-to-b via-transparent to-transparent blur-3xl"
        style={{
          background: `linear-gradient(to bottom, ${themeColors.primary}10, transparent, transparent)`
        }}
      ></div>

    </div>
  );
}