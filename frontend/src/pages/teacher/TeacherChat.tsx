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

interface Class {
  _id: string;
  name: string;
  chatRoomId?:string;
}

const TeacherChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, error } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth.user);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Fetch teacher's classes
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
        console.log('error in teacher chat .tsx getclasses fun in useEffect: ',err)
        dispatch(setError('Failed to fetch classes'));
      }
    };
    getClasses();
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

      {/* Class List Sidebar (WhatsApp Style) */}
      <div
        className={`fixed md:static inset-0 md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 md:ml-64`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Classes</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
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
                  {cls.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">{cls.name}</h3>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 p-4 sm:p-6 md:ml-80">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 sm:text-2xl">
            {selectedClassName ? `${selectedClassName} Chat` : 'Teacher Chat'}
          </h1>
          <NotificationBell />
        </div>
        {error && (
          <div className="mb-4 text-red-500 dark:text-red-400 sm:mb-6">Error: {error}</div>
        )}
        {selectedClassId ? (
          <ChatWindow
            messages={messages}
            sendMessage={sendMessage}
            chatRoomId={selectedClassId}
            isTeacher={true}
          />
        ) : (
          <div className="text-gray-500 dark:text-gray-400">Please select a class to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default TeacherChat;