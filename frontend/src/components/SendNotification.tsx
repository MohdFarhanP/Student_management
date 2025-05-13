import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { socket } from '../socket';

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
      // Interpret the input as IST (Asia/Kolkata) and convert to UTC
      const scheduledDateIST = new Date(scheduledAt); // e.g., "2025-05-05T14:03" in IST
      const scheduledDateUTC = new Date(
        scheduledDateIST.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
      ).toISOString(); // Convert to UTC
      console.log('Scheduled time (IST):', scheduledDateIST.toLocaleString());
      console.log('Scheduled time (UTC):', scheduledDateUTC);
  
      // Validate that the scheduled time is in the future (in UTC)
      const nowUTC = new Date().toISOString();
      if (scheduledDateUTC <= nowUTC) {
        setError('Scheduled time must be in the future');
        return;
      }
  
      notification.scheduledAt = scheduledDateUTC; // Store in UTC
    }
  
    socket.emit('sendNotification', notification);
    setTitle('');
    setMessage('');
    setRecipientIds('');
    setScheduledAt('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Send Notificaion</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {success && <div className="mb-4 text-green-500">{success}</div>}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="mb-2 w-full rounded border p-2 text-black"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        className="mb-2 w-full rounded border p-2 text-black"
      />
      <select
        value={recipientType}
        onChange={(e) => setRecipientType(e.target.value as 'global' | 'role' | 'Student')}
        className="mb-2 w-full rounded border p-2 text-black"
      >
        <option value="global">Global</option>
        {user.role === 'Admin' && <option value="role">Role</option>}
        <option value="Student">Student</option>
      </select>
      {recipientType !== 'global' && (
        <input
          type="text"
          value={recipientIds}
          onChange={(e) => setRecipientIds(e.target.value)}
          placeholder={
            recipientType === 'role'
              ? 'Enter roles (e.g., teacher,student)'
              : 'Enter student IDs (comma-separated)'
          }
          className="mb-2 w-full rounded border p-2 text-black  "
        />
      )}
      <input
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
        className="mb-2 w-full rounded border p-2 text-black"
      />
      <button onClick={handleSend} className="rounded bg-blue-500 p-2 text-white">
        Send
      </button>
    </div>
  );
};

export default SendNotification;