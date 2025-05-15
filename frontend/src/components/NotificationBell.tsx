import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchNotifications, markNotificationAsRead, addNotification, Notification } from '../redux/slices/notificationSlice';
import { socket } from '../socket';
import { BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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
    <div className="relative z-50">
      <div className="dropdown dropdown-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-primary btn-circle btn-md relative"
        >
          <BellIcon className="h-6 w-6 text-primary-content" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 badge badge-error badge-sm text-white">
              {unreadCount}
            </span>
          )}
        </button>
        {isOpen && (
          <div className="dropdown-content mt-2 w-80 max-h-96 overflow-y-auto card bg-base-100 dark:bg-gray-800 shadow-xl z-50">
            <div className="card-body p-4">
              {error && (
                <div className="mb-4">
                  <div className="alert alert-error shadow-lg">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                </div>
              )}
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`card mb-2 p-3 ${
                      notification.isRead
                        ? 'bg-base-100 dark:bg-gray-700'
                        : 'bg-primary/10 dark:bg-primary/20'
                    } shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-2">
                      <BellIcon className="h-5 w-5 text-primary dark:text-primary-content mt-1" />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-base-content dark:text-white">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.scheduledAt
                            ? `Scheduled: ${convertToIST(notification.scheduledAt)}`
                            : `Created: ${convertToIST(notification.createdAt)}`}
                        </p>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="btn btn-ghost btn-xs text-primary dark:text-primary-content mt-2"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;