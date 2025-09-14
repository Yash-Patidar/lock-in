'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import { settingsAtom, notificationAtom, TIMER_MODES } from '@/store/atoms';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useAtom(settingsAtom);
  const setNotification = useSetAtom(notificationAtom);
  
  const [localSettings, setLocalSettings] = useState(settings);

  const saveSettings = () => {
    setSettings(localSettings);
    
    // Create new timer mode objects with updated durations
    TIMER_MODES.POMODORO = { ...TIMER_MODES.POMODORO, duration: localSettings.focusTime * 60 };
    TIMER_MODES.SHORT_BREAK = { ...TIMER_MODES.SHORT_BREAK, duration: localSettings.shortBreakTime * 60 };
    TIMER_MODES.LONG_BREAK = { ...TIMER_MODES.LONG_BREAK, duration: localSettings.longBreakTime * 60 };
    
    setNotification('Settings saved! ⚙️');
    onClose();
  };

  const handleClose = () => {
    setLocalSettings(settings); // Reset to original settings
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-effect rounded-2xl p-6 m-4 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Focus Time (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.focusTime}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                focusTime: parseInt(e.target.value) || 25
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Short Break (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={localSettings.shortBreakTime}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                shortBreakTime: parseInt(e.target.value) || 5
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Long Break (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.longBreakTime}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                longBreakTime: parseInt(e.target.value) || 15
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}