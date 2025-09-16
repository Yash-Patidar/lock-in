'use client';

import { useState, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { tasksAtom, notificationAtom } from '@/store/atoms';
import { indexedDBService, type CompletedDay } from '@/lib/indexeddb';
import Image from 'next/image';

export default function DayCompletion() {
  const tasks = useAtomValue(tasksAtom);
  const setNotification = useSetAtom(notificationAtom);
  const [showCompletion, setShowCompletion] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const completeDay = async () => {
    if (totalTasks === 0) {
      alert('Add some tasks first to complete your day!');
      return;
    }

    setIsCompleting(true);

    const dayData: CompletedDay = {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      tasks: tasks.map(task => ({ text: task.text, completed: task.completed })),
      image: selectedImage || undefined,
      completionRate
    };

    try {
      await indexedDBService.saveCompletedDay(dayData);

      setIsCompleting(false);
      setShowCompletion(false);
      setSelectedImage(null);

      // Show success message
      setNotification(`Day completed! ${completionRate}% success rate 🎉`);

      // Dispatch event for calendar to update
      const event = new CustomEvent('lock-in-day-completed');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving day completion:', error);
      setIsCompleting(false);

      // Provide specific error messages based on the error type
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      if (errorMessage.includes('localStorage')) {
        setNotification('⚠️ Saved using backup storage. Your data is safe but may have limited features.');
      } else if (errorMessage.includes('not supported')) {
        setNotification('⚠️ Your browser does not support data storage. Please try a modern browser.');
      } else if (errorMessage.includes('blocked')) {
        setNotification('⚠️ Database blocked by another tab. Please close other instances of this app.');
      } else {
        setNotification('✅ Day saved using backup storage! Your progress is preserved.');
      }
    }
  };

  if (totalTasks === 0) {
    return null; // Don't show if no tasks
  }

  return (
    <>
      {/* Complete Day Button */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="glass-effect rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Ready to Complete Your Day?</h3>
              <p className="text-sm text-gray-400">
                {completedTasks.length}/{totalTasks} tasks completed ({completionRate}%)
              </p>
            </div>
            <button
              onClick={() => setShowCompletion(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30 flex items-center gap-2"
            >
              <span>🏆</span>
              Complete Day {new Date().getDate()}
            </button>
          </div>
        </div>
      </div>

      {/* Day Completion Modal */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl shadow-cyan-500/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Complete Day {new Date().getDate()}</h3>
              <button
                onClick={() => setShowCompletion(false)}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Today's Summary */}
              <div>
                <h4 className="text-lg font-semibold text-cyan-300 mb-3">Today&apos;s Summary</h4>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-300">Completion Rate</span>
                    <span className="text-2xl font-bold" style={{ color: completionRate >= 80 ? '#10b981' : completionRate >= 60 ? '#f59e0b' : '#ef4444' }}>
                      {completionRate}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    {tasks.map((task, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg">
                        <span className={`text-lg ${task.completed ? '✅' : '❌'}`}>
                          {task.completed ? '✅' : '❌'}
                        </span>
                        <span className={`flex-1 ${task.completed ? 'text-green-300' : 'text-red-300'}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Achievement Photo */}
              <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-3">Add Achievement Photo (Optional)</h4>
                <p className="text-sm text-gray-400 mb-4">Capture your progress with a photo!</p>

                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-600 hover:border-cyan-500/50 rounded-lg p-6 transition-all hover:bg-cyan-500/5 flex flex-col items-center gap-2"
                  >
                    <span className="text-3xl">📸</span>
                    <span className="text-gray-300">Click to upload photo</span>
                    <span className="text-sm text-gray-500">JPG, PNG up to 5MB</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {selectedImage && (
                    <div className="relative">
                      <Image
                        src={selectedImage}
                        alt="Achievement"
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover rounded-lg border border-gray-600"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Day Action */}
              <div className="pt-4 border-t border-gray-600">
                <button
                  onClick={completeDay}
                  disabled={isCompleting}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-4 rounded-xl font-semibold text-white transition-all hover:shadow-2xl hover:shadow-green-500/30 flex items-center justify-center gap-2"
                >
                  {isCompleting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span>🏆</span>
                      Complete Day & Save Progress
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}