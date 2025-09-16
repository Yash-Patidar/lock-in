'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { notesService, StickyNote as Note } from '@/lib/notesDB';
import StickyNote from '@/components/StickyNote';
import Navbar from '@/components/Navbar';
import SettingsModal from '@/components/SettingsModal';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const createNewNote = useCallback(async () => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const maxX = (containerRect?.width || 1200) - 280;
    const maxY = (containerRect?.height || 800) - 300;

    // Better positioning - avoid overlap with existing notes
    const existingPositions = notes.map(n => n.position);
    let randomX: number = 0;
    let randomY: number = 0;
    let attempts = 0;

    do {
      randomX = Math.random() * maxX + 50;
      randomY = Math.random() * maxY + 150;
      attempts++;
    } while (
      attempts < 10 &&
      existingPositions.some(pos =>
        Math.abs(pos.x - randomX) < 300 && Math.abs(pos.y - randomY) < 250
      )
    );

    const colors = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newNote = {
      title: 'Quick Note',
      content: '',
      color: randomColor,
      position: { x: randomX, y: randomY },
      size: { width: 280, height: 250 },
      pinned: false,
      tags: []
    };

    try {
      const id = await notesService.createNote(newNote);
      await loadNotes();
      setSelectedNote(id);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  }, [notes]);

  const deleteNote = useCallback(async (id: number) => {
    try {
      await notesService.deleteNote(id);
      await loadNotes();
      if (selectedNote === id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }, [selectedNote]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSearch(false);
    loadNotes();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewNote();
      }

      if (e.key === 'Delete' && selectedNote) {
        e.preventDefault();
        deleteNote(selectedNote);
      }

      if (e.key === 'Escape') {
        setSelectedNote(null);
        if (showSearch) {
          clearSearch();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNote, showSearch, createNewNote, deleteNote, clearSearch]);

  const loadNotes = async () => {
    try {
      const allNotes = await notesService.getAllNotes();
      setNotes(allNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const updateNote = async (id: number, updates: Partial<Note>) => {
    try {
      await notesService.updateNote(id, updates);
      await loadNotes();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };


  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const searchResults = await notesService.searchNotes(query);
        setNotes(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      loadNotes();
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/95 via-black/98 to-gray-900/95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.02)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.03)_0%,transparent_50%)]"></div>
      </div>

      {/* Navbar */}
      <Navbar onSettingsOpen={() => setIsSettingsOpen(true)} />

      {/* Main Layout */}
      <div className="flex h-screen">

        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-black/20 backdrop-blur-sm pt-16">
          <div className="p-4 border-b border-white/10">
            <div className="text-white/60 text-sm mb-2">
              {notes.length} note{notes.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-white/10">
            {showSearch ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full bg-white/10 text-white placeholder-white/50 px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-white/40 text-sm"
                  autoFocus
                />
                <button
                  onClick={clearSearch}
                  className="text-white/60 hover:text-white transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="w-full glass-effect px-3 py-2 rounded-lg text-white/80 hover:text-white transition-colors border border-white/20 hover:border-white/40 flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 space-y-3">
            <button
              onClick={createNewNote}
              className="w-full glass-effect px-3 py-2 rounded-lg text-white font-medium border border-white/20 hover:border-yellow-400/40 transition-all hover:scale-105 flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </button>

            <button
              onClick={() => {
                const createTodoNote = async () => {
                  const containerRect = containerRef.current?.getBoundingClientRect();
                  const randomX = Math.random() * ((containerRect?.width || 1200) - 280) + 50;
                  const randomY = Math.random() * ((containerRect?.height || 800) - 300) + 150;

                  const todoNote = {
                    title: 'Todo List',
                    content: '• Task 1\n• Task 2\n• Task 3',
                    color: 'blue',
                    position: { x: randomX, y: randomY },
                    size: { width: 280, height: 250 },
                    pinned: false,
                    tags: ['todo']
                  };

                  try {
                    const id = await notesService.createNote(todoNote);
                    await loadNotes();
                    setSelectedNote(id);
                  } catch (error) {
                    console.error('Failed to create todo note:', error);
                  }
                };
                createTodoNote();
              }}
              className="w-full glass-effect px-3 py-2 rounded-lg text-white/80 hover:text-white border border-white/20 hover:border-blue-400/40 transition-all hover:scale-105 flex items-center gap-2 text-sm"
              title="Quick Todo List"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Todo List
            </button>

            <button
              onClick={() => {
                const createIdeaNote = async () => {
                  const containerRect = containerRef.current?.getBoundingClientRect();
                  const randomX = Math.random() * ((containerRect?.width || 1200) - 280) + 50;
                  const randomY = Math.random() * ((containerRect?.height || 800) - 300) + 150;

                  const ideaNote = {
                    title: 'Bright Idea',
                    content: 'Write down your brilliant idea here...',
                    color: 'purple',
                    position: { x: randomX, y: randomY },
                    size: { width: 280, height: 250 },
                    pinned: false,
                    tags: ['idea']
                  };

                  try {
                    const id = await notesService.createNote(ideaNote);
                    await loadNotes();
                    setSelectedNote(id);
                  } catch (error) {
                    console.error('Failed to create idea note:', error);
                  }
                };
                createIdeaNote();
              }}
              className="w-full glass-effect px-3 py-2 rounded-lg text-white/80 hover:text-white border border-white/20 hover:border-purple-400/40 transition-all hover:scale-105 flex items-center gap-2 text-sm"
              title="Quick Idea Note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Idea Note
            </button>
          </div>
        </div>

        {/* Notes Container - Desktop */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden pt-16"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedNote(null);
            }
          }}
        >
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <div className="w-24 h-24 mb-6 text-white/40 animate-bounce">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white/80">Welcome to Sticky Notes!</h2>
            <p className="text-lg mb-8 text-center max-w-md text-white/60">
              Capture your thoughts, ideas, and reminders with beautiful, draggable sticky notes
            </p>
            <div className="flex gap-4">
              <button
                onClick={createNewNote}
                className="glass-effect px-8 py-4 rounded-xl text-white font-medium border border-white/20 hover:border-yellow-400/60 transition-all hover:scale-105 flex items-center gap-3 shadow-2xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Note
              </button>
              <button
                onClick={() => {
                  const createDemoNotes = async () => {
                    const demoNotes = [
                      {
                        title: 'Daily Goals',
                        content: '• Complete project proposal\n• Review team feedback\n• Schedule client meeting',
                        color: 'blue',
                        position: { x: 100, y: 200 },
                        size: { width: 280, height: 250 },
                        pinned: true,
                        tags: ['goals', 'daily']
                      },
                      {
                        title: 'Brilliant Ideas',
                        content: 'New app feature idea:\nAdd voice notes to sticky notes for better accessibility and faster input!',
                        color: 'purple',
                        position: { x: 420, y: 250 },
                        size: { width: 280, height: 250 },
                        pinned: false,
                        tags: ['idea', 'feature']
                      },
                      {
                        title: 'Shopping List',
                        content: '• Milk\n• Bread\n• Eggs\n• Coffee beans\n• Fruits',
                        color: 'green',
                        position: { x: 740, y: 200 },
                        size: { width: 280, height: 250 },
                        pinned: false,
                        tags: ['shopping']
                      }
                    ];

                    for (const note of demoNotes) {
                      await notesService.createNote(note);
                    }
                    await loadNotes();
                  };
                  createDemoNotes();
                }}
                className="glass-effect px-6 py-4 rounded-xl text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-all hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-10 0h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                Try Demo Notes
              </button>
            </div>
          </div>
        ) : (
          notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
              isSelected={selectedNote === note.id}
              onSelect={setSelectedNote}
            />
          ))
        )}
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-effect border-t border-white/10">
        <div className="flex items-center justify-around p-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="glass-effect p-3 rounded-lg text-white/80 hover:text-white transition-all border border-white/20 hover:border-white/40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button
            onClick={createNewNote}
            className="glass-effect p-3 rounded-lg text-white font-medium border border-white/20 hover:border-yellow-400/40 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <button
            onClick={() => {
              const createTodoNote = async () => {
                const containerRect = containerRef.current?.getBoundingClientRect();
                const randomX = Math.random() * ((containerRect?.width || 400) - 280) + 20;
                const randomY = Math.random() * ((containerRect?.height || 600) - 300) + 100;

                const todoNote = {
                  title: 'Todo List',
                  content: '• Task 1\n• Task 2\n• Task 3',
                  color: 'blue',
                  position: { x: randomX, y: randomY },
                  size: { width: 280, height: 250 },
                  pinned: false,
                  tags: ['todo']
                };

                try {
                  const id = await notesService.createNote(todoNote);
                  await loadNotes();
                  setSelectedNote(id);
                } catch (error) {
                  console.error('Failed to create todo note:', error);
                }
              };
              createTodoNote();
            }}
            className="glass-effect p-3 rounded-lg text-white/80 hover:text-white border border-white/20 hover:border-blue-400/40 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </button>

          <button
            onClick={() => {
              const createIdeaNote = async () => {
                const containerRect = containerRef.current?.getBoundingClientRect();
                const randomX = Math.random() * ((containerRect?.width || 400) - 280) + 20;
                const randomY = Math.random() * ((containerRect?.height || 600) - 300) + 100;

                const ideaNote = {
                  title: 'Bright Idea',
                  content: 'Write down your brilliant idea here...',
                  color: 'purple',
                  position: { x: randomX, y: randomY },
                  size: { width: 280, height: 250 },
                  pinned: false,
                  tags: ['idea']
                };

                try {
                  const id = await notesService.createNote(ideaNote);
                  await loadNotes();
                  setSelectedNote(id);
                } catch (error) {
                  console.error('Failed to create idea note:', error);
                }
              };
              createIdeaNote();
            }}
            className="glass-effect p-3 rounded-lg text-white/80 hover:text-white border border-white/20 hover:border-purple-400/40 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>

          <div className="text-white/60 text-xs">
            {notes.length}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search notes..."
                className="flex-1 bg-white/10 text-white placeholder-white/50 px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-white/40 text-sm"
                autoFocus
              />
              <button
                onClick={() => setShowSearch(false)}
                className="text-white/60 hover:text-white transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Spacer */}
      <div className="lg:hidden h-16"></div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}