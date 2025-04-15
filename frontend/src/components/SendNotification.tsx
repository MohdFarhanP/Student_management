import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { socket } from '../socket';

const SendNotification: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<
    'global' | 'role' | 'Student'
  >('global');
  const [recipientIds, setRecipientIds] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    socket.on('error', (err: string) => {
      setError(err);
    });

    return () => {
      socket.off('error');
    };
  }, [user]);

  if (!user || !['Admin', 'Teacher'].includes(user.role)) return null;

  const handleSend = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    const notification = {
      title: title.trim(),
      message: message.trim(),
      recipientType,
      recipientIds:
        recipientType !== 'global' && recipientIds.trim()
          ? recipientIds.split(',').map((id) => id.trim())
          : undefined,
      senderId: user.id,
      senderRole: user.role as 'Admin' | 'Teacher',
    };

    console.log('Sending notification:', notification);
    socket.emit('sendNotification', notification);
    setTitle('');
    setMessage('');
    setRecipientIds('');
    setError(null);
  };

  return (
    <div className="rounded-lg bg-gray-100 text-gray-800 p-4">
      <h2 className="mb-4 text-xl">Send Notification</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="mb-2 w-full rounded border p-2"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        className="mb-2 w-full rounded border p-2"
      />
      <select
        value={recipientType}
        onChange={(e) =>
          setRecipientType(e.target.value as 'global' | 'role' | 'Student')
        }
        className="mb-2 w-full rounded border p-2"
      >
        <option value="global">Global</option>
        {user.role === 'admin' && <option value="role">Role</option>}
        <option value="student">Student</option>
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
          className="mb-2 w-full rounded border p-2"
        />
      )}
      <button
        onClick={handleSend}
        className="rounded bg-blue-500 p-2 text-white"
      >
        Send
      </button>
    </div>
  );
};

export default SendNotification;
