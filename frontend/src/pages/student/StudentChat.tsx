import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatWindow from '../../components/ChatWindow';
import { RootState, AppDispatch } from '../../redux/store';
import { addMessage, setError } from '../../redux/slices/chatSlice';
import { Message } from '../../types/message';
import { socket } from '../../socket';

const StudentChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, error } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socket.emit('joinRoom', 'class-123');
      socket.emit('loadMessages', 'class-123');
    });

    socket.on('initialMessages', (messages: Message[]) => {
      messages.forEach((msg) => dispatch(addMessage(msg)));
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
    };
  }, [dispatch, user]);

  const sendMessage = (content: string, mediaUrl?: string, mediaType?: string) => {
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
    <div className='p-4'>
      <h1 className='text-2xl mb-4'>Student Chat</h1>
      <ChatWindow
        messages={messages}
        sendMessage={sendMessage}
        chatRoomId='class-123'
        isTeacher={false}
      />
    </div>
  );
};

export default StudentChat;