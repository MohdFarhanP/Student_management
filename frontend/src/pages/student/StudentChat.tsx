import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatWindow from '../../components/ChatWindow';
import { RootState, AppDispatch } from '../../redux/store';
import { addMessage } from '../../redux/slices/chatSlice';
import { Message } from '../../types/message';
import { socket } from '../../socket';

const StudentChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, error } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return;
    let loaded = false;
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socket.emit('joinRoom', 'class-123', () => {
        console.log('Joined room class-123');
      });
      socket.emit('loadMessages', 'class-123');
      loaded = true;
    });
    socket.on('initialMessages', (messages: Message[]) => {
      console.log('Received initialMessages:', messages);
      messages.forEach((msg) => dispatch(addMessage(msg)));
    });
    socket.on('message', (message: Message) => {
      console.log('Received new message:', message);
      dispatch(addMessage(message));
    });
    // Handle reconnect
    socket.on('reconnect', () => {
      if (!loaded) {
        socket.emit('loadMessages', 'class-123');
      }
    });
    return () => {
      socket.off('connect');
      socket.off('initialMessages');
      socket.off('message');
      socket.off('reconnect');
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
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl">Student Chat</h1>
      <ChatWindow
        messages={messages}
        sendMessage={sendMessage}
        chatRoomId="class-123"
        isTeacher={false}
      />
    </div>
  );
};

export default StudentChat;
