import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatWindow from '../../components/ChatWindow';
import NotificationBell from '../../components/NotificationBell';
import StudentSidebar from '../../components/StudentSidebar'; 
import { RootState, AppDispatch } from '../../redux/store' ;
import { addMessage, setMessages, setError } from '../../redux/slices/chatSlice';
import { Message } from '../../types/message';
import { socket } from '../../socket';
import { fetchStudentClass } from '../../api/admin/classApi';

interface Class {
  _id: string;
  chatRoomId?: string;
  name: string;
  section?: string;
  grade?: string;
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
        const classData = await fetchStudentClass();
        setClassData(classData);
      } catch (err) {
        console.log('ERROR from student chat.tsx:', err);
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

  if (!user) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Please log in to access the chat.</div>;
  if (!classData) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading class data...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <StudentSidebar />
      <div className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 md:ml-45">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100">
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