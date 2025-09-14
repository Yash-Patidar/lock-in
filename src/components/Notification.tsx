'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { notificationAtom } from '@/store/atoms';

export default function Notification() {
  const [notification, setNotification] = useAtom(notificationAtom);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 max-w-sm p-4 glass-effect rounded-lg text-white transform transition-transform duration-300 z-50 notification">
      <div>{notification}</div>
    </div>
  );
}