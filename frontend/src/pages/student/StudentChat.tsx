// src/pages/StudentChat.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatWindow from '../../components/ChatWindow';
import NotificationBell from '../../components/NotificationBell';
import StudentSidebar from '../../components/StudentSidebar';
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

const StudentChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, error } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth.user);
  const [classData, setClassData] = useState<Class | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch student's class
    const fetchClass = async () => {
      try {
        const response = await axios.get('/api/teacher/my-class', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setClassData(response.data);
      } catch (err) {
        dispatch(setError('Failed to fetch class'));
      }
    };
    fetchClass();
  }, [user, dispatch]);

  useEffect(() => {
    if (!user || !classData) return;

    socket.io.opts.query = { userId: user.id, userRole: user.role };
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socket.emit('joinRoom', classData.chatRoomId, () => {
        console.log(`Joined room ${classData.chatRoomId}`);
        socket.emit('loadMessages', classData.chatRoomId);
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
  }, [dispatch, user, classData]);

  const sendMessage = (
    content: string,
    mediaUrl?: string,
    mediaType?: string
  ) => {
    if (!user || !classData) return;
    socket.emit('sendMessage', {
      chatRoomId: classData.chatRoomId,
      senderId: user.id,
      senderRole: user.role,
      content,
      mediaUrl,
      mediaType,
    });
  };

  if (!user) return <div>Please log in to access the chat.</div>;
  if (!classData) return <div>Loading class data...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <StudentSidebar />
      <div className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 lg:ml-45">
        <div className="flex flex-row items-center justify-between sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <h1 className="text-xl pl-[50px] sm:pl-0 md:pl-10 sm:text-2xl lg:text-3xl lg:pl-0 font-bold mb-2 sm:mb-0 text-gray-800 dark:text-gray-100">
            {classData.name} Chat
          </h1>
          <NotificationBell />
        </div>
        {error && (
          <div className="mb-4 sm:mb-6 text-red-500 dark:text-red-400 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            Error: {error}
          </div>
        )}
        <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <ChatWindow
            messages={messages}
            sendMessage={sendMessage}
            chatRoomId={classData.chatRoomId}
            isTeacher={false}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentChat;