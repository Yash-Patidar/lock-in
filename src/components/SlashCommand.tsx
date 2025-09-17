/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import tippy from 'tippy.js';

interface CommandItem {
  title: string;
  description: string;
  icon: string;
  command: (editor: any) => void;
}

interface CommandListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

const CommandList = forwardRef<any, CommandListProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const upHandler = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const downHandler = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  };

  return (
    <div className="glass-effect border border-white/20 rounded-lg p-2 shadow-xl max-h-64 overflow-y-auto">
      {items.map((item, index) => (
        <button
          key={index}
          className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-3 ${
            index === selectedIndex
              ? 'bg-cyan-500/20 text-cyan-300'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
          onClick={() => selectItem(index)}
        >
          <span className="text-lg">{item.icon}</span>
          <div className="flex-1">
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-xs text-white/60">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
});

CommandList.displayName = 'CommandList';

const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: false,
        command: ({ editor, range, props }: any) => {
          props.command(editor, range);
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          const commands: CommandItem[] = [
            {
              title: 'Heading 1',
              description: 'Large section heading',
              icon: '📝',
              command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            },
            {
              title: 'Heading 2',
              description: 'Medium section heading',
              icon: '📖',
              command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            },
            {
              title: 'Heading 3',
              description: 'Small section heading',
              icon: '📄',
              command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            },
            {
              title: 'Bold',
              description: 'Make text bold',
              icon: '🔥',
              command: (editor) => editor.chain().focus().toggleBold().run(),
            },
            {
              title: 'Italic',
              description: 'Make text italic',
              icon: '✨',
              command: (editor) => editor.chain().focus().toggleItalic().run(),
            },
            {
              title: 'Bullet List',
              description: 'Create a bullet list',
              icon: '📋',
              command: (editor) => editor.chain().focus().toggleBulletList().run(),
            },
            {
              title: 'Numbered List',
              description: 'Create a numbered list',
              icon: '🔢',
              command: (editor) => editor.chain().focus().toggleOrderedList().run(),
            },
            {
              title: 'To-Do List',
              description: 'Create a to-do list with checkboxes',
              icon: '✅',
              command: (editor) => editor.chain().focus().toggleTaskList().run(),
            },
            {
              title: 'To-Do Item',
              description: 'Add a single to-do checkbox',
              icon: '☑️',
              command: (editor) => {
                editor.chain().focus().toggleTaskList().run();
                // Add a simple task item
                editor.chain().focus().splitListItem('taskItem').run();
              },
            },
            {
              title: 'Quote',
              description: 'Create a blockquote',
              icon: '💬',
              command: (editor) => editor.chain().focus().toggleBlockquote().run(),
            },
            {
              title: 'Code Block',
              description: 'Create a code block',
              icon: '💻',
              command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
            },
            {
              title: 'Divider',
              description: 'Add a horizontal rule',
              icon: '➖',
              command: (editor) => editor.chain().focus().setHorizontalRule().run(),
            },
          ];

          return commands.filter((command) =>
            command.title.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          let component: ReactRenderer;
          let popup: any;

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
              });

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                theme: 'dark',
              });
            },

            onUpdate(props: any) {
              component.updateProps(props);

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
              }

              return (component.ref as any)?.onKeyDown?.(props);
            },

            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});

export default SlashCommand;