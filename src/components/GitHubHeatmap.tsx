'use client';

import { useAtom } from 'jotai';
import { heatmapDataAtom } from '@/store/atoms';

export default function GitHubHeatmap() {
  const [heatmapData, setHeatmapData] = useAtom(heatmapDataAtom);

  const handleCellClick = (dateString: string, currentLevel: number) => {
    const newLevel = currentLevel >= 4 ? 0 : currentLevel + 1;
    setHeatmapData(prev => ({
      ...prev,
      [dateString]: newLevel
    }));
  };

  const getHeatmapColor = (level: number) => {
    const colors = [
      'bg-slate-800 border-slate-700',
      'bg-cyan-900/40 border-cyan-800/50',
      'bg-cyan-700/60 border-cyan-600/50', 
      'bg-cyan-500/80 border-cyan-400/50',
      'bg-cyan-400 border-cyan-300/50',
      'bg-cyan-300 border-cyan-200/50'
    ];
    return colors[level] || colors[0];
  };

  const generateHeatmapCells = () => {
    const cells = [];
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364); // 365 days total

    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toDateString();
      const level = heatmapData[dateString] || 0;

      cells.push(
        <div
          key={i}
          className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm cursor-pointer transition-all hover:scale-110 border ${getHeatmapColor(level)}`}
          title={`${date.toLocaleDateString()} - Level ${level} (Click to change)`}
          onClick={() => handleCellClick(dateString, level)}
        />
      );
    }

    return cells;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      <div className="glass-effect rounded-2xl p-4 md:p-6 border-2 border-cyan-400/20">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-cyan-100 flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          Progress Heatmap
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        </h2>
        
        {/* GitHub-style contribution graph */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px] md:min-w-0">
            <div 
              className="grid gap-1 mb-4" 
              style={{ 
                gridTemplateColumns: 'repeat(53, minmax(0, 1fr))',
                gridTemplateRows: 'repeat(7, minmax(0, 1fr))'
              }}
            >
              {generateHeatmapCells()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-cyan-200/70">
          <span className="hidden sm:block">Sep 2024 - Dec 2025</span>
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 bg-slate-800 rounded-sm border border-slate-700"></div>
              <div className="w-2.5 h-2.5 bg-cyan-900/40 rounded-sm border border-cyan-800/50"></div>
              <div className="w-2.5 h-2.5 bg-cyan-700/60 rounded-sm border border-cyan-600/50"></div>
              <div className="w-2.5 h-2.5 bg-cyan-500/80 rounded-sm border border-cyan-400/50"></div>
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-sm border border-cyan-300/50"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}