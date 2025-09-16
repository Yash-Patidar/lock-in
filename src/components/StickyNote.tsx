'use client';

import { useState, useRef, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { StickyNote as Note } from '@/lib/notesDB';

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: number, updates: Partial<Note>) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const noteColors = [
  { name: 'yellow', bg: 'rgba(254, 243, 199, 0.95)', border: '#f59e0b', shadow: 'rgba(245, 158, 11, 0.3)' },
  { name: 'pink', bg: 'rgba(252, 231, 243, 0.95)', border: '#ec4899', shadow: 'rgba(236, 72, 153, 0.3)' },
  { name: 'blue', bg: 'rgba(219, 234, 254, 0.95)', border: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.3)' },
  { name: 'green', bg: 'rgba(209, 250, 229, 0.95)', border: '#10b981', shadow: 'rgba(16, 185, 129, 0.3)' },
  { name: 'purple', bg: 'rgba(233, 213, 255, 0.95)', border: '#8b5cf6', shadow: 'rgba(139, 92, 246, 0.3)' },
  { name: 'orange', bg: 'rgba(254, 215, 170, 0.95)', border: '#f97316', shadow: 'rgba(249, 115, 22, 0.3)' },
  { name: 'gray', bg: 'rgba(243, 244, 246, 0.95)', border: '#6b7280', shadow: 'rgba(107, 114, 128, 0.3)' }
];

export default function StickyNote({ note, onUpdate, onDelete, isSelected, onSelect }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nodeRef = useRef(null);

  const currentColor = noteColors.find(c => c.name === note.color) || noteColors[0];

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleSave = () => {
    if (note.id) {
      onUpdate(note.id, {
        title: title.trim() || 'Untitled',
        content: content.trim()
      });
    }
    setIsEditing(false);
  };

  const handleColorChange = (color: string) => {
    if (note.id) {
      onUpdate(note.id, { color });
    }
    setShowColorPicker(false);
  };

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (note.id) {
      onUpdate(note.id, { position: { x: data.x, y: data.y } });
    }
  };

  const togglePin = () => {
    if (note.id) {
      onUpdate(note.id, { pinned: !note.pinned });
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={note.position}
      onStop={handleDrag}
      handle=".note-handle"
      disabled={isEditing}
    >
      <div
        ref={nodeRef}
        className={`absolute select-none transition-all duration-300 transform ${
          isSelected ? 'scale-105 z-50' : 'hover:scale-102 z-10'
        } ${isEditing ? 'z-50' : ''}`}
        style={{
          width: note.size.width,
          minHeight: note.size.height,
        }}
        onClick={() => onSelect(note.id!)}
      >
        <div
          className="relative rounded-2xl shadow-2xl transition-all duration-300 border-0 backdrop-blur-md"
          style={{
            backgroundColor: currentColor.bg,
            boxShadow: isSelected
              ? `0 25px 50px ${currentColor.shadow}, 0 0 0 3px ${currentColor.border}40`
              : `0 10px 30px ${currentColor.shadow}, 0 5px 15px rgba(0,0,0,0.1)`
          }}
        >
          {/* Header */}
          <div className="note-handle flex items-center justify-between p-4 cursor-move">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="flex-1 bg-transparent font-bold text-gray-800 placeholder-gray-500 outline-none text-base mr-2"
              placeholder="Note title..."
              disabled={!isEditing}
            />

            <div className="flex items-center gap-2">
              {/* Pin Button */}
              <button
                onClick={togglePin}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  note.pinned
                    ? 'bg-yellow-500/90 text-white shadow-lg transform rotate-12'
                    : 'hover:bg-black/10 text-gray-600 hover:scale-110'
                }`}
                title={note.pinned ? 'Unpin note' : 'Pin note'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>

              {/* Color Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-8 h-8 rounded-lg border-2 border-white shadow-lg hover:scale-110 transition-all duration-200 hover:rotate-12"
                  style={{ backgroundColor: currentColor.border }}
                  title="Change color"
                />
                {showColorPicker && (
                  <div className="absolute top-10 right-0 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-3 z-50 grid grid-cols-4 gap-3">
                    {noteColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(color.name)}
                        className="w-8 h-8 rounded-lg border-2 border-white shadow-lg hover:scale-125 transition-all duration-200"
                        style={{ backgroundColor: color.border }}
                        title={`${color.name} color`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => note.id && onDelete(note.id)}
                className="w-8 h-8 rounded-lg hover:bg-red-500/90 hover:text-white text-gray-500 flex items-center justify-center transition-all duration-200 hover:scale-110"
                title="Delete note"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 pt-0">
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleSave();
                  }
                }}
                className="w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none resize-none text-base leading-relaxed font-medium"
                placeholder="What's on your mind?"
                style={{ minHeight: '120px' }}
              />
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="cursor-text text-gray-700 text-base leading-relaxed whitespace-pre-wrap min-h-[120px] font-medium hover:bg-black/5 rounded-lg p-2 -m-2 transition-colors duration-200"
              >
                {content || (
                  <span className="text-gray-400 italic">Click to add content...</span>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pb-3 text-xs text-gray-500 flex justify-between items-center border-t border-black/5 pt-2">
            <span className="font-medium">
              {new Date(note.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {note.tags.length > 0 && (
              <div className="flex gap-1">
                {note.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-black/10 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {note.tags.length > 2 && (
                  <span className="text-gray-400">+{note.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
}