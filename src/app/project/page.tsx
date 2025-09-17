/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Provider } from 'jotai';
import { useAtomValue } from 'jotai';
import { themeColorsAtom } from '@/store/themeAtoms';
import Navbar from '@/components/Navbar';
import DynamicBackground from '@/components/DynamicBackground';
import BlobCursor from '@/components/BlobCursor';
import SettingsModal from '@/components/SettingsModal';
import { ComicText } from "@/components/ui/comic-text";
import TiptapEditor from '@/components/TiptapEditor';
import './novel-editor.css';

interface Project {
  id: string;
  title: string;
  description: string;
  content: any;
  createdAt: number;
  updatedAt: number;
  color: string;
  emoji: string;
}

export default function ProjectPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const themeColors = useAtomValue(themeColorsAtom);

  const projectColors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-purple-500 to-pink-600',
    'from-cyan-500 to-blue-600',
    'from-yellow-500 to-orange-600'
  ];

  const projectEmojis = ['🚀', '💡', '🎯', '⚡', '🔥', '💎', '🌟', '🎨', '🛠️', '📈'];

  useEffect(() => {
    loadProjects();

    // Check for shared project
    const urlParams = new URLSearchParams(window.location.search);
    const sharedId = urlParams.get('id');
    if (sharedId) {
      const saved = localStorage.getItem('simple-projects');
      if (saved) {
        const allProjects = JSON.parse(saved);
        const shared = allProjects.find((p: Project) => p.id === sharedId);
        if (shared) setCurrentProject(shared);
      }
    }
  }, []);

  const loadProjects = () => {
    const saved = localStorage.getItem('simple-projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  };

  const saveProjects = (updatedProjects: Project[]) => {
    localStorage.setItem('simple-projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const createProject = () => {
    if (!newProjectTitle.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      title: newProjectTitle,
      description: newProjectDesc,
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Start writing your page content... Type '/' for formatting commands" }]
          }
        ]
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      color: projectColors[Math.floor(Math.random() * projectColors.length)],
      emoji: projectEmojis[Math.floor(Math.random() * projectEmojis.length)]
    };

    const updated = [...projects, newProject];
    saveProjects(updated);
    setNewProjectTitle('');
    setNewProjectDesc('');
    setShowCreateModal(false);
    showNotification('Page created successfully!');
  };

  const deleteProject = (projectId: string) => {
    const updated = projects.filter(p => p.id !== projectId);
    saveProjects(updated);
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
    showNotification('Page deleted');
  };

  const updateProject = (updates: Partial<Project>) => {
    if (!currentProject) return;

    const updated = { ...currentProject, ...updates, updatedAt: Date.now() };
    const updatedProjects = projects.map(p =>
      p.id === currentProject.id ? updated : p
    );

    saveProjects(updatedProjects);
    setCurrentProject(updated);
  };


  const shareProject = (project: Project) => {
    const url = `${window.location.origin}/project?id=${project.id}`;
    navigator.clipboard.writeText(url);
    showNotification('Page link copied to clipboard!');
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Project List View
  if (!currentProject) {
    return (
      <Provider>
        <div className="min-h-screen app-background relative overflow-hidden">
          {/* Background matching your app theme */}
          <div className="fixed inset-0 bg-black/90 backdrop-blur-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black/40 to-gray-900/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.015)_0%,transparent_60%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.02)_0%,transparent_60%)]"></div>
          </div>

          <div className="fixed inset-0 opacity-10">
            <DynamicBackground />
          </div>

          <BlobCursor
            fillColor={themeColors.primary}
            trailCount={3}
            sizes={[30, 60, 40]}
            innerSizes={[10, 20, 15]}
            opacities={[0.9, 0.6, 0.3]}
            shadowColor={themeColors.glowColor}
            shadowBlur={20}
          />

          <Navbar onSettingsOpen={() => setIsSettingsOpen(true)} />

          <div className="relative z-10 text-white pt-20 px-4">
            <div className="max-w-6xl mx-auto">

              {/* Header */}
              <div className="text-center mb-12">
                <ComicText fontSize={2.5} className="text-white mb-4">
                  Team Pages
                </ComicText>
                <p className="text-gray-400 text-lg mb-8">
                  Simple page management for your team
                </p>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="glass-effect px-6 py-3 rounded-xl text-white hover:text-cyan-300 transition-all duration-300 border border-white/20 hover:border-cyan-400/60 hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Page
                </button>
              </div>

              {/* Projects Grid */}
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="glass-effect rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}></div>

                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{project.emoji}</span>
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {project.title}
                              </h3>
                              {project.description && (
                                <p className="text-gray-400 text-sm mt-1">
                                  {project.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                shareProject(project);
                              }}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                              title="Share project"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Delete this project?')) {
                                  deleteProject(project.id);
                                }
                              }}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                              title="Delete project"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                          <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                        </div>

                        <button
                          onClick={() => setCurrentProject(project)}
                          className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium"
                        >
                          Open Page
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-6 opacity-50">📁</div>
                  <h3 className="text-xl font-semibold text-white/80 mb-2">No pages yet</h3>
                  <p className="text-gray-400">Create your first page to get started</p>
                </div>
              )}

              {/* Create Project Modal */}
              {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                  <div className="glass-effect rounded-2xl p-6 max-w-md w-full">
                    <h3 className="text-xl font-bold text-white mb-6">Create New Page</h3>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Page title"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                        className="w-full glass-effect border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/60"
                        autoFocus
                      />

                      <textarea
                        placeholder="Page description (optional)"
                        value={newProjectDesc}
                        onChange={(e) => setNewProjectDesc(e.target.value)}
                        className="w-full glass-effect border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/60 resize-none h-24"
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={createProject}
                        disabled={!newProjectTitle.trim()}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                      >
                        Create Page
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateModal(false);
                          setNewProjectTitle('');
                          setNewProjectDesc('');
                        }}
                        className="flex-1 glass-effect border border-white/20 hover:border-white/40 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-300">
              <div className="glass-effect rounded-xl px-4 py-3 text-white border border-green-400/30 bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">{notification}</span>
                </div>
              </div>
            </div>
          )}

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </div>
      </Provider>
    );
  }

  // Project Detail View
  return (
    <Provider>
      <div className="min-h-screen app-background relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 bg-black/90 backdrop-blur-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black/40 to-gray-900/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.015)_0%,transparent_60%)]"></div>
        </div>

        <div className="fixed inset-0 opacity-10">
          <DynamicBackground />
        </div>

        <BlobCursor
          fillColor={themeColors.primary}
          trailCount={3}
          sizes={[30, 60, 40]}
          innerSizes={[10, 20, 15]}
          opacities={[0.9, 0.6, 0.3]}
          shadowColor={themeColors.glowColor}
          shadowBlur={20}
        />

        <Navbar onSettingsOpen={() => setIsSettingsOpen(true)} />

        <div className="relative z-10 text-white pt-20 px-4">
          <div className="max-w-4xl mx-auto">

            {/* Tiptap Editor with inline project title */}
            <div className="glass-effect rounded-xl p-6">
              {/* Inline Project Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{currentProject.emoji}</span>
                  <input
                    type="text"
                    value={currentProject.title}
                    onChange={(e) => updateProject({ title: e.target.value })}
                    className="text-xl font-bold bg-transparent border-none outline-none text-white placeholder-white/50 flex-1"
                    placeholder="Project title..."
                  />
                </div>

                <button
                  onClick={() => shareProject(currentProject)}
                  className="px-3 py-1.5 rounded-lg text-white/70 hover:text-cyan-300 hover:bg-white/10 transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </button>
              </div>

              <TiptapEditor
                content={currentProject.content}
                onUpdate={(content) => updateProject({ content })}
                placeholder="Start writing your page content... Type '/' for commands"
              />
            </div>

          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-300">
            <div className="glass-effect rounded-xl px-4 py-3 text-white border border-green-400/30 bg-gradient-to-r from-green-500/20 to-emerald-500/20">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">{notification}</span>
              </div>
            </div>
          </div>
        )}

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </Provider>
  );
}

