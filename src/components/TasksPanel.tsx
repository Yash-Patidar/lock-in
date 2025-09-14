'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useState, useMemo } from 'react';
import { tasksAtom, activeTaskAtom, Task, notificationAtom } from '@/store/atoms';

type FilterType = 'all' | 'active' | 'completed';

export default function TasksPanel() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [activeTask, setActiveTask] = useAtom(activeTaskAtom);
  const setNotification = useSetAtom(notificationAtom);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

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

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Hide completed tasks if toggle is off
    if (!showCompletedTasks) {
      filtered = filtered.filter(task => !task.completed);
    }

    // Apply filter
    switch (filter) {
      case 'active':
        return filtered.filter(task => !task.completed);
      case 'completed':
        return filtered.filter(task => task.completed);
      default:
        return filtered;
    }
  }, [tasks, filter, showCompletedTasks]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [tasks]);

  const clearCompletedTasks = () => {
    const completedCount = tasks.filter(task => task.completed).length;
    setTasks(prev => prev.filter(task => !task.completed));
    if (completedCount > 0) {
      setNotification(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}! 🧹`);
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Today&apos;s Mission</h2>
        <div className="flex items-center gap-2">
          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
            {taskStats.active} active
          </span>
          <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
            {taskStats.completed} done
          </span>
        </div>
      </div>
      
      {/* Task Controls */}
      <div className="flex flex-col gap-3 mb-4 md:mb-6">
        {/* Filter Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 text-sm rounded-lg transition-all capitalize ${
                  filter === filterType
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Toggle completed tasks visibility */}
            <button
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className={`px-3 py-1 text-sm rounded-lg transition-all ${
                showCompletedTasks
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-orange-500 text-white'
              }`}
              title={showCompletedTasks ? 'Hide completed tasks' : 'Show completed tasks'}
            >
              {showCompletedTasks ? '👁️' : '👁️‍🗨️'}
            </button>

            {/* Clear completed tasks */}
            {taskStats.completed > 0 && (
              <button
                onClick={clearCompletedTasks}
                className="px-3 py-1 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
                title="Clear all completed tasks"
              >
                🧹 Clear
              </button>
            )}
          </div>
        </div>

        {/* Add Task */}
        <div className="flex gap-2">
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
      </div>

      {/* Task List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            {filter === 'all' && tasks.length === 0 && (
              <div>
                <div className="text-4xl mb-2">📝</div>
                <p>No tasks yet. Add your first task above!</p>
              </div>
            )}
            {filter === 'active' && taskStats.active === 0 && (
              <div>
                <div className="text-4xl mb-2">✨</div>
                <p>All tasks completed! Great work!</p>
              </div>
            )}
            {filter === 'completed' && taskStats.completed === 0 && (
              <div>
                <div className="text-4xl mb-2">💪</div>
                <p>No completed tasks yet. Keep going!</p>
              </div>
            )}
            {!showCompletedTasks && filteredTasks.length === 0 && tasks.length > 0 && (
              <div>
                <div className="text-4xl mb-2">👀</div>
                <p>Completed tasks are hidden</p>
              </div>
            )}
          </div>
        ) : (
          filteredTasks.map(task => (
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
          ))
        )}
      </div>

      {/* Task Statistics Footer */}
      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Progress: {taskStats.completed}/{taskStats.total} tasks completed
            </span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs">
                {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}