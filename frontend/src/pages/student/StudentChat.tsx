import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatWindow from '../../components/ChatWindow';
import NotificationBell from '../../components/NotificationBell';
import StudentSidebar from '../../components/StudentSidebar';
import { RootState, AppDispatch } from '../../redux/store';
import {
  addMessage,
  setMessages,
  setError,
} from '../../redux/slices/chatSlice';
import { Message } from '../../types/message';
import { socket } from '../../socket';

const StudentChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, error } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    socket.io.opts.query = { userId: user.id };
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socket.emit('joinRoom', 'class-123', () => {
        console.log('Joined room class-123');
        socket.emit('loadMessages', 'class-123');
      });
    });

    socket.on('initialMessages', (messages: Message[]) => {
      console.log('Received initialMessages:', messages);
      dispatch(setMessages(messages));
    });

    socket.on('message', (message: Message) => {
      console.log('Received new message:', message);
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
  }, [dispatch, user]);

  const sendMessage = (
    content: string,
    mediaUrl?: string,
    mediaType?: string
  ) => {
    if (!user) return;
    socket.emit('sendMessage', {
      chatRoomId: 'class-123',
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
      <StudentSidebar />
      <div className="ml-70 flex-1 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">
            Student Chat
          </h1>
          <NotificationBell />
        </div>
        {error && (
          <div className="mb-4 text-red-500 sm:mb-6">Error: {error}</div>
        )}
        <ChatWindow
          messages={messages}
          sendMessage={sendMessage}
          chatRoomId="class-123"
          isTeacher={false}
        />
      </div>
    </div>
  );
};

export default StudentChat;
