'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import { tasksAtom, activeTaskAtom, Task, notificationAtom } from '@/store/atoms';

export default function TasksPanel() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [activeTask, setActiveTask] = useAtom(activeTaskAtom);
  const setNotification = useSetAtom(notificationAtom);
  const [newTaskText, setNewTaskText] = useState('');

  const addTask = () => {
    const text = newTaskText.trim();
    if (text) {
      const newTask: Task = {
        id: Date.now(),
        text: text,
        completed: false,
        pomodoros: 0
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskText('');
      setNotification('Task added! 🎯');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      setNotification('Great job! Keep going! 🔥');
    }
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    if (activeTask && activeTask.id === id) {
      setActiveTask(null);
    }
  };

  const setActiveTaskById = (id: number) => {
    const task = tasks.find(t => t.id === id);
    setActiveTask(activeTask && activeTask.id === id ? null : task || null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Today&apos;s Mission</h2>
      
      {/* Add Task */}
      <div className="flex gap-2 mb-4 md:mb-6">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none"
        />
        <button
          onClick={addTask}
          className="bg-cyan-500 hover:bg-cyan-600 px-3 md:px-4 py-2 rounded-lg transition-all"
        >
          ➕
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              task.completed 
                ? 'bg-green-900/30 border border-green-800' 
                : 'bg-gray-700/50 border border-gray-600'
            } ${
              activeTask && activeTask.id === task.id 
                ? 'ring-2 ring-blue-400' 
                : ''
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                task.completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-400 hover:border-green-400'
              }`}
            >
              {task.completed ? '✓' : ''}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className={task.completed ? 'line-through text-gray-400' : ''}>
                {task.text}
              </div>
              {task.pomodoros > 0 && (
                <div className="text-xs text-gray-400 mt-1">
                  🍅 {task.pomodoros} pomodoro{task.pomodoros !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setActiveTaskById(task.id)}
              className={`px-2 py-1 text-xs rounded transition-all ${
                activeTask && activeTask.id === task.id 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              {activeTask && activeTask.id === task.id ? 'Active' : 'Select'}
            </button>
            
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}