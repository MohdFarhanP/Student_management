// src/pages/TeacherChat.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatWindow from '../../components/ChatWindow';
import NotificationBell from '../../components/NotificationBell';
import TeacherSidebar from '../../components/TeacherSidebar';
import { RootState, AppDispatch } from '../../redux/store';
import { addMessage, setMessages, setError } from '../../redux/slices/chatSlice';
import { Message } from '../../types/message';
import { socket } from '../../socket';
import axios from 'axios';

interface Class {
  chatRoomId: string;
  name: string;
  grade: string;
  section: string;
}

const TeacherChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, error } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth.user);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch teacher's classes
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/api/teacher/classes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setClasses(response.data);
        if (response.data.length > 0) {
          setSelectedClassId(response.data[0].chatRoomId);
        }
      } catch (err) {
        dispatch(setError('Failed to fetch classes'));
      }
    };
    fetchClasses();
  }, [user, dispatch]);

  useEffect(() => {
    if (!user || !selectedClassId) return;

    socket.io.opts.query = { userId: user.id, userRole: user.role };
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socket.emit('joinRoom', selectedClassId, () => {
        console.log(`Joined room ${selectedClassId}`);
        socket.emit('loadMessages', selectedClassId);
      });
    });

    socket.on('initialMessages', (messages: Message[]) => {
      dispatch(setMessages(messages));
    });

    socket.on('message', (message: Message) => {
      dispatch(addMessage(message));
    });

    socket.on('error', (err: string) => {
      dispatch(setError(err));
    });

    return () => {
      socket.off('connect');
      socket.off('initialMessages');
      socket.off('message');
      socket.off('error');
      socket.disconnect();
    };
  }, [dispatch, user, selectedClassId]);

  const sendMessage = (
    content: string,
    mediaUrl?: string,
    mediaType?: string
  ) => {
    if (!user || !selectedClassId) return;
    socket.emit('sendMessage', {
      chatRoomId: selectedClassId,
      senderId: user.id,
      senderRole: user.role,
      content,
      mediaUrl,
      mediaType,
    });
  };

  if (!user) return <div>Please log in to access the chat.</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="ml-64 flex-1 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">
              Teacher Chat
            </h1>
            <select
              value={selectedClassId || ''}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a class
              </option>
              {classes.map((cls) => (
                <option key={cls.chatRoomId} value={cls.chatRoomId}>
                  {cls.name} ({cls.grade} - {cls.section})
                </option>
              ))}
            </select>
          </div>
          <NotificationBell />
        </div>
        {error && (
          <div className="mb-4 text-red-500 sm:mb-6">Error: {error}</div>
        )}
        {selectedClassId ? (
          <ChatWindow
            messages={messages}
            sendMessage={sendMessage}
            chatRoomId={selectedClassId}
            isTeacher={true}
          />
        ) : (
          <div className="text-gray-500">Please select a class to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default TeacherChat;