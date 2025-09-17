/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import SlashCommand from './SlashCommand';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: any;
  onUpdate: (content: any) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onUpdate, placeholder = "Start writing..." }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      SlashCommand.configure({
        suggestion: {
          char: '/',
          startOfLine: false,
          command: ({ editor, range, props }: { editor: any, range: any, props: any }) => {
            const { from, to } = range;
            editor.chain().focus().deleteRange({ from, to }).run();
            props.command(editor);
          },
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onUpdate(json);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full tiptap-editor ProseMirror',
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-white/10 rounded mb-4"></div>
        <div className="h-4 bg-white/5 rounded mb-2"></div>
        <div className="h-4 bg-white/5 rounded mb-2"></div>
        <div className="h-4 bg-white/5 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="tiptap-editor-container">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-4 p-2 rounded-lg bg-white/5 border border-white/10">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          H3
        </button>
        <div className="w-px h-6 bg-white/10 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            editor.isActive('bold')
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded text-sm italic transition-colors ${
            editor.isActive('italic')
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-3 py-1.5 rounded text-sm font-mono transition-colors ${
            editor.isActive('code')
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Code
        </button>
        <div className="w-px h-6 bg-white/10 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('taskList')
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          ✓ To-Do
        </button>
        <div className="w-px h-6 bg-white/10 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Quote
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1.5 rounded text-sm font-mono transition-colors ${
            editor.isActive('codeBlock')
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          {'{ }'}
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}