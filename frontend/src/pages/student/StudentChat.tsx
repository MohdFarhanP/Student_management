import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { addMessage, setMessages, setError } from '../../redux/slices/chatSlice';
import { Message } from '../../types/message';
import { socket } from '../../socket';
import { fetchStudentClass } from '../../api/admin/classApi';
import ErrorBoundary from '../../components/ErrorBoundary';

// Lazy load components
const StudentSidebar = lazy(() => import('../../components/StudentSidebar'));
const ChatWindow = lazy(() => import('../../components/ChatWindow'));
const NotificationBell = lazy(() => import('../../components/NotificationBell'));

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
  const user = useSelector(
    (state: RootState) => state.auth.user,
    (prev, next) => prev?.id === next?.id
  );
  const [classData, setClassData] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log('User is null, cannot fetch class');
      setIsLoading(false);
      return;
    }

    console.log('Fetching class for user:', user.id);

    const fetchClass = async () => {
      try {
        setIsLoading(true);
        const classdata = await fetchStudentClass();
        console.log('fetched class data form backend', classdata);
        setClassData(classdata);
        if (!classdata) {
          dispatch(setError('No class assigned to this student'));
        }
      } catch (err) {
        console.error('ERROR from student chat.tsx:', err);
        dispatch(setError('Failed to fetch class'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchClass();
  }, [user, dispatch]);

  useEffect(() => {
    if (user && classData?.chatRoomId) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [user, classData]);

  useEffect(() => {
    if (!isReady) {
      console.log('Missing user or classData.chatRoomId, skipping socket setup');
      return;
    }
  
    const chatRoomId = classData!.chatRoomId;
    console.log('StudentChat: Socket connected state before joinRoom:', socket.connected);
  
    socket.emit('joinRoom', chatRoomId, (res: { [key: string]: boolean }) => {
      console.log(`Join room response for ${chatRoomId}:`, res || 'Success');
      socket.emit('loadMessages', chatRoomId);
    });
  
    const handleConnect = () => {
      console.log('StudentChat: Socket connected, socket ID:', socket.id);
      socket.emit('joinRoom', chatRoomId, (res: { [key: string]: boolean }) => {
        console.log(`Join room response for ${chatRoomId}:`, res || 'Success');
        socket.emit('loadMessages', chatRoomId);
      });
    };
  
    const handleConnectError = (error: Error) => {
      console.error('Socket connection error in StudentChat:', error.message);
      dispatch(setError('Failed to connect to chat server: ' + error.message));
    };
  
    const handleInitialMessages = (messages: Message[]) => {
      console.log('Received initial messages in StudentChat:', messages);
      dispatch(setMessages(messages));
    };
  
    const handleMessage = (message: Message) => {
      console.log('Received new message in StudentChat:', message);
      dispatch(addMessage(message));
    };
  
    const handleError = (err: string) => {
      console.error('Socket error in StudentChat:', err);
      dispatch(setError(err));
    };
  
    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('initialMessages', handleInitialMessages);
    socket.on('message', handleMessage);
    socket.on('error', handleError);
  
    return () => {
      console.log('Cleaning up socket listeners for chat room id', chatRoomId || 'unknown');
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('initialMessages', handleInitialMessages);
      socket.off('message', handleMessage);
      socket.off('error', handleError);
    };
  }, [isReady, dispatch, classData ]);

  const sendMessage = useCallback(
    (content: string, mediaUrl?: string, mediaType?: string) => {
      if (!user || !classData || !classData.chatRoomId) {
        console.error('Cannot send message: user or classData missing');
        dispatch(setError('Cannot send message: Class data not loaded'));
        return;
      }
      console.log('Emitting sendMessage event:', { chatRoomId: classData.chatRoomId, content, mediaUrl, mediaType });
      socket.emit('sendMessage', {
        chatRoomId: classData.chatRoomId,
        senderId: user.id,
        senderRole: user.role,
        content,
        mediaUrl,
        mediaType,
      });
    },
    [user, classData, dispatch]
  );

  if (!user) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Please log in to access the chat.</div>;
  if (isLoading) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading class data...</div>;
  if (!classData) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">No class assigned to this student.</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Suspense fallback={<div className="p-4">Loading Sidebar...</div>}>
        <StudentSidebar />
      </Suspense>
      <div className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 md:ml-45">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 ml-15 dark:text-gray-100">
            {classData.name} Chat
          </h1>
          <Suspense fallback={<div className="p-2">Loading...</div>}>
            <NotificationBell />
          </Suspense>
        </div>
        {error && (
          <div className="mb-4 sm:mb-6 text-red-500 dark:text-red-400 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            Error: {error}
          </div>
        )}
        <ErrorBoundary>
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <Suspense fallback={<div className="p-4">Loading Chat...</div>}>
              <ChatWindow
                messages={messages}
                sendMessage={sendMessage}
                chatRoomId={classData.chatRoomId}
              />
            </Suspense>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default StudentChat;