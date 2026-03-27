'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playAudioAlert, showBrowserNotification } from '@/lib/notifications';

interface Notification {
  id: string;
  orderId: string;
  orderNumber: string;
  message: string;
  type: 'ready' | 'late';
}

interface NotificationOverlayProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationOverlay({ notifications, onDismiss }: NotificationOverlayProps) {
  const [shownNotifications, setShownNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    notifications.forEach((notif) => {
      if (!shownNotifications.has(notif.id)) {
        // Play audio alert
        playAudioAlert(3);

        // Show browser notification
        showBrowserNotification(
          notif.orderNumber,
          {
            body: notif.message,
            icon: '/icon.svg',
            tag: notif.id,
          },
        );

        setShownNotifications((prev) => new Set(prev).add(notif.id));
      }
    });
  }, [notifications, shownNotifications]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2 pointer-events-auto">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`rounded-lg border-2 p-4 flex items-start gap-3 animate-in slide-in-from-right ${
            notif.type === 'ready'
              ? 'bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-900'
              : 'bg-red-50 border-red-300 dark:bg-red-950 dark:border-red-900'
          }`}
        >
          <Bell
            className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
              notif.type === 'ready'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          />

          <div className="flex-1">
            <p
              className={`font-semibold ${
                notif.type === 'ready'
                  ? 'text-green-900 dark:text-green-300'
                  : 'text-red-900 dark:text-red-300'
              }`}
            >
              {notif.orderNumber}
            </p>
            <p
              className={`text-sm ${
                notif.type === 'ready'
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-red-700 dark:text-red-400'
              }`}
            >
              {notif.message}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex-shrink-0"
            onClick={() => onDismiss(notif.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
