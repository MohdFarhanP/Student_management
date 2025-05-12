import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchNotifications, markNotificationAsRead, addNotification, Notification } from '../redux/slices/notificationSlice';
import { socket } from '../socket';

const NotificationBell: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, error } = useSelector((state: RootState) => state.notification);
  const user = useSelector((state: RootState) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);

  // Utility to convert UTC to IST
  const convertToIST = (utcDate: string | Date): string => {
    const date = new Date(utcDate);
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  useEffect(() => {
    if (!user) return;

    socket.io.opts.query = { userId: user.id, userRole: user.role };
    dispatch(fetchNotifications({ userId: user.id, userRole: user.role }));
    socket.emit('joinNotification');

    socket.on('notification', (notification: Notification) => {
      console.log('Received notification:', notification);
      dispatch(addNotification(notification));
    });

    return () => {
      socket.off('notification');
    };
  }, [dispatch, user]);

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full bg-blue-500 p-2 text-white"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 max-h-96 w-80 overflow-y-auto rounded-lg bg-white p-4 shadow-lg">
          {error && <div className="mb-2 text-red-500">{error}</div>}
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`mb-2 rounded p-2 ${notification.isRead ? 'bg-gray-100' : 'bg-blue-100'}`}
              >
                <h3 className="font-bold">{notification.title}</h3>
                <p>{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {notification.scheduledAt
                    ? `Scheduled: ${convertToIST(notification.scheduledAt)}`
                    : `Created: ${convertToIST(notification.createdAt)}`}
                </p>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-sm text-blue-500"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;