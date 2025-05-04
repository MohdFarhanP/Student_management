import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatWindow from '../../components/ChatWindow';
import NotificationBell from '../../components/NotificationBell';
import TeacherSidebar from '../../components/TeacherSidebar';
import { RootState, AppDispatch } from '../../redux/store';
import { addMessage, setMessages, setError } from '../../redux/slices/chatSlice';
import { Message } from '../../types/message';
import { socket } from '../../socket';
import { fetchClasses } from '../../api/admin/classApi';
import SendNotificationModal from '../../components/SendNotificationModal';
import { MdSend } from 'react-icons/md';

interface Class {
  _id: string;
  name: string;
  chatRoomId?: string;
}

const TeacherChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, error } = useSelector((state: RootState) => state.chat);
  const user = useSelector(
    (state: RootState) => state.auth.user,
    (prev, next) => prev?.id === next?.id
  );
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('TeacherChat: User changed:', user);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const getClasses = async () => {
      try {
        const response = await fetchClasses();
        if (response) {
          setClasses(response);
          if (response.length > 0 && response[0].chatRoomId) {
            setSelectedClassId(response[0].chatRoomId);
            setSelectedClassName(response[0].name);
          }
        } else {
          dispatch(setError('No class data found.'));
        }
      } catch (err) {
        console.log('error in teacher chat .tsx getclasses fun in useEffect: ', err);
        dispatch(setError('Failed to fetch classes'));
      }
    };
    getClasses();
  }, [user, dispatch]);

  useEffect(() => {
    if (!user || !selectedClassId) {
      console.log('Missing user or selectedClassId, skipping socket setup');
      return;
    }

    socket.io.opts.query = { userId: user.id, userRole: user.role };
    console.log('TeacherChat: Setting socket query:', socket.io.opts.query);

    socket.emit('joinRoom', selectedClassId, (res: { [key: string]: boolean }) => {
      console.log(`Join room response for ${selectedClassId}:`, res || 'Success');
      socket.emit('loadMessages', selectedClassId);
    });

    const handleConnect = () => {
      console.log('TeacherChat: Socket connected, socket ID:', socket.id);
      socket.emit('joinRoom', selectedClassId, (res: { [key: string]: boolean }) => {
        console.log(`Join room response for ${selectedClassId}:`, res || 'Success');
        socket.emit('loadMessages', selectedClassId);
      });
    };

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error in TeacherChat:', error.message);
      dispatch(setError('Failed to connect to chat server: ' + error.message));
    };

    const handleInitialMessages = (messages: Message[]) => {
      console.log('Received initial messages in TeacherChat:', messages);
      dispatch(setMessages(messages));
    };

    const handleMessage = (message: Message) => {
      console.log('Received new message in TeacherChat:', message);
      dispatch(addMessage(message));
    };

    const handleError = (err: string) => {
      console.error('Socket error in TeacherChat:', err);
      dispatch(setError(err));
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('initialMessages', handleInitialMessages);
    socket.on('message', handleMessage);
    socket.on('error', handleError);

    return () => {
      console.log('Cleaning up socket listeners for TeacherChat');
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('initialMessages', handleInitialMessages);
      socket.off('message', handleMessage);
      socket.off('error', handleError);
    };
  }, [dispatch, user, selectedClassId]);

  const sendMessage = (
    content: string,
    mediaUrl?: string,
    mediaType?: string
  ) => {
    if (!user || !selectedClassId) {
      console.error('Cannot send message: user or selectedClassId missing');
      dispatch(setError('Cannot send message: Class not selected'));
      return;
    }
    console.log('Emitting sendMessage event:', { chatRoomId: selectedClassId, content, mediaUrl, mediaType });
    socket.emit('sendMessage', {
      chatRoomId: selectedClassId,
      senderId: user.id,
      senderRole: user.role,
      content,
      mediaUrl,
      mediaType,
    });
  };

  const handleClassSelect = (chatRoomId: string, className: string) => {
    setSelectedClassId(chatRoomId);
    setSelectedClassName(className);
    setIsSidebarOpen(false);
  };

  if (!user) return <div className="p-4 text-center text-gray-500">Please log in to access the chat.</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <TeacherSidebar />

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Unified Chat Container (Class List + Chat Window) with Size Constraints */}
      <div className="flex flex-1 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 md:ml-45">
        {/* Class List Sidebar */}
        <div
          className={`fixed md:static inset-0 md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 md:border-r-0 md:rounded-l-lg md:shadow-none`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Classes</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-10rem)]">
            {classes
              .filter(cls => cls.chatRoomId)
              .map((cls) => (
                <div
                  key={cls.chatRoomId}
                  onClick={() => handleClassSelect(cls.chatRoomId as string, cls.name)}
                  className={`p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    selectedClassId === cls.chatRoomId ? 'bg-gray-200 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {cls.name.charAt(1)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">{cls.name}</h3>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-white dark:bg-gray-800 md:rounded-r-lg md:shadow-lg">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 sm:text-2xl">
              {selectedClassName ? `${selectedClassName} Chat` : 'Teacher Chat'}
            </h1>
            <div className="flex items-center space-x-3">
              <SendNotificationModal
                trigger={
                  <button
                    title="Send Notification"
                    className="p-2 text-gray-800 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    <MdSend size={24} />
                  </button>
                }
              />
              <NotificationBell />
            </div>
          </div>
          {error && (
            <div className="p-4 text-red-500 dark:text-red-400 sm:p-6">
              Error: {error}
            </div>
          )}
          {selectedClassId ? (
            <ChatWindow
              messages={messages}
              sendMessage={sendMessage}
              chatRoomId={selectedClassId}
              isTeacher={true}
            />
          ) : (
            <div className="p-4 text-gray-500 dark:text-gray-400 sm:p-6">
              Please select a class to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherChat;