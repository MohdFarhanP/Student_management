import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { socket } from '../socket';
import { BellIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const SendNotification: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<'global' | 'role' | 'Student'>('global');
  const [recipientIds, setRecipientIds] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    socket.on('error', (err: string) => setError(err));
    socket.on('notificationScheduled', () => setSuccess('Notification scheduled successfully'));

    return () => {
      socket.off('error');
      socket.off('notificationScheduled');
    };
  }, [user]);

  if (!user || !['Admin', 'Teacher'].includes(user.role)) return null;

  const handleSend = () => {
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    const notification: {
      title: string;
      message: string;
      recipientType: 'global' | 'role' | 'Student';
      recipientIds?: string[];
      senderId: string;
      senderRole: 'Admin' | 'Teacher';
      scheduledAt?: string;
    } = {
      title: title.trim(),
      message: message.trim(),
      recipientType,
      recipientIds:
        recipientType !== 'global' && recipientIds.trim()
          ? recipientIds.split(',').map((id) => id.trim()).filter((id) => id)
          : undefined,
      senderId: user.id,
      senderRole: user.role as 'Admin' | 'Teacher',
    };

    if (scheduledAt) {
      const scheduledDateIST = new Date(scheduledAt);
      const scheduledDateUTC = new Date(
        scheduledDateIST.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
      ).toISOString();

      const nowUTC = new Date().toISOString();
      if (scheduledDateUTC <= nowUTC) {
        setError('Scheduled time must be in the future');
        return;
      }

      notification.scheduledAt = scheduledDateUTC;
    }

    socket.emit('sendNotification', notification);
    setTitle('');
    setMessage('');
    setRecipientIds('');
    setScheduledAt('');
  };

  return (
    <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6">
      <h2 className="text-xl font-semibold text-base-content dark:text-white mb-4 flex items-center gap-2">
        <BellIcon className="h-6 w-6 text-primary dark:text-primary-content" />
        Send Notification
      </h2>
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
      {success && (
        <div className="mb-4">
          <div className="alert alert-success shadow-lg">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{success}</span>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="input input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
          />
          <BellIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="textarea textarea-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
        />
        <div className="relative">
          <select
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value as 'global' | 'role' | 'Student')}
            className="select select-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
          >
            <option value="global">Global</option>
            {user.role === 'Admin' && <option value="role">Role</option>}
            <option value="Student">Student</option>
          </select>
          <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        {recipientType !== 'global' && (
          <div className="relative">
            <input
              type="text"
              value={recipientIds}
              onChange={(e) => setRecipientIds(e.target.value)}
              placeholder={
                recipientType === 'role'
                  ? 'Enter roles (e.g., teacher,student)'
                  : 'Enter student IDs (comma-separated)'
              }
              className="input input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
            />
            <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <div className="relative">
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="input input-bordered w-full pl-10 bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:ring-primary"
          />
          <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <button
          onClick={handleSend}
          className="btn btn-primary w-full"
        >
          Send Notification
        </button>
      </div>
    </div>
  );
};

export default SendNotification;