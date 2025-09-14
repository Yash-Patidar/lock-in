export default function KeyboardShortcuts() {
  return (
    <div className="fixed bottom-6 left-6 glass-effect rounded-xl p-4 text-xs text-cyan-100/70 border border-cyan-400/20 shadow-lg shadow-cyan-500/10">
      <div className="font-semibold mb-2 text-cyan-300 flex items-center gap-2">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
        Shortcuts
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded text-cyan-300 font-mono text-xs">Space</kbd>
          <span>Start/Pause</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded text-cyan-300 font-mono text-xs">R</kbd>
          <span>Reset Timer</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded text-cyan-300 font-mono text-xs">1-3</kbd>
          <span>Switch Modes</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded text-cyan-300 font-mono text-xs">S</kbd>
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
}