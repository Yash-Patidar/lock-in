'use client';

import { useState } from 'react';

export default function SocialLinks() {
  const [showProjects, setShowProjects] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const socialLinks = [
    {
      name: 'X (Twitter)',
      url: 'https://twitter.com/yash__patidar_',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Yash-Patidar/lock-in',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    }
  ];

  const projects = [
    {
      name: '🖼️ AI Studio',
      url: 'https://picxstudio.com',
      description: 'AI-powered creative studio'
    },
    {
      name: '🤖 TypeThink AI',
      url: 'https://typethink.ai',
      description: 'Smart typing assistant'
    },
    {
      name: '📢 Vine Ad',
      url: 'https://vine.ad',
      description: 'Marketing automation'
    },
    {
      name: '📸 Ditto AI',
      url: 'https://dittoai.co',
      description: 'AI photo generation'
    }
  ];

  const shortcuts = [
    { key: 'Space', action: 'Start/Stop Timer' },
    { key: 'T', action: 'Focus Task Input' },
    { key: 'S', action: 'Open Settings' },
    { key: 'Esc', action: 'Close Modals' }
  ];

  return (
    <>
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-40">
        <div className="flex items-center gap-1 bg-gray-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-full p-1.5 shadow-lg shadow-cyan-500/10">
          {/* Social Links */}
          {socialLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 group relative ${
                index === 0 ? 'hover:bg-cyan-500/20 hover:text-cyan-400' :
                'hover:bg-gray-500/20 hover:text-gray-300'
              }`}
              title={link.name}
            >
              {link.icon}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {link.name}
              </div>
            </a>
          ))}

          {/* Separator */}
          <div className="w-px h-4 bg-gray-600 mx-1"></div>

          {/* Projects Button */}
          <button
            onClick={() => setShowProjects(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-200 hover:scale-110 group relative"
            title="My Projects"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Projects
            </div>
          </button>

          {/* Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-200 hover:scale-110 group relative"
            title="Keyboard Shortcuts"
          >
            <span className="text-sm font-bold">?</span>
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Help
            </div>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-200 hover:scale-110 group relative"
            title="Settings"
          >
            <span className="text-sm">⚙️</span>
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Settings
            </div>
          </button>
        </div>
      </div>

      {/* Projects Dialog */}
      {showProjects && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">My Projects</h3>
              <button
                onClick={() => setShowProjects(false)}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-white mb-2">Yash Patidar</div>
              <div className="text-cyan-400 mb-2">@yash__patidar_</div>
              <div className="text-gray-300 text-sm mb-4">🧠 Quit dev job. 🚀 Full-time indie hacking.</div>
            </div>

            <div className="space-y-3">
              {projects.map((project) => (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-800/50 hover:bg-cyan-500/10 border border-gray-700 hover:border-cyan-500/30 rounded-lg transition-all duration-200 group"
                >
                  <div className="font-medium text-white group-hover:text-cyan-300">{project.name}</div>
                  <div className="text-sm text-gray-400">{project.description}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help Dialog */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <span className="text-gray-300">{shortcut.action}</span>
                  <kbd className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-sm font-mono border border-cyan-500/30">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Dialog Placeholder */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-4">⚙️</div>
              <p>Settings panel coming soon!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}