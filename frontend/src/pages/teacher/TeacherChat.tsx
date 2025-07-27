import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatWindow from '../../components/ChatWindow';
import TeacherSidebar from '../../components/TeacherSidebar';
import { RootState, AppDispatch } from '../../redux/store';
import { addMessage, setMessages, setError } from '../../redux/slices/chatSlice';
import { Message } from '../../types/message';
import { socket } from '../../socket';
import { fetchClasses } from '../../api/admin/classApi';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import SendNotificationModal from '../../components/SendNotificationModal';
import { MdOutlineNotificationsNone } from 'react-icons/md';

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
        console.error('Error in TeacherChat getClasses:', err);
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 dark:bg-gray-900">
        <div className="alert alert-error shadow-lg max-w-md">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Please log in to access the chat.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900">
      <TeacherSidebar />
      <div className="flex flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-1 max-w-6xl mx-auto bg-base-100 dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          {/* Class List Sidebar */}
          <div
            className={`fixed md:static inset-0 md:w-64 bg-base-100 dark:bg-gray-800 border-r border-base-200 dark:border-gray-700 transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 md:rounded-l-lg md:shadow-none`}
          >
            <div className="p-4 border-b border-base-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-base-content dark:text-white">
                Classes
              </h2>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-8rem)]">
              {classes.length === 0 ? (
                <p className="p-4 text-gray-500 dark:text-gray-400">
                  No classes available.
                </p>
              ) : (
                classes
                  .filter(cls => cls.chatRoomId)
                  .map((cls) => (
                    <div
                      key={cls.chatRoomId}
                      onClick={() => handleClassSelect(cls.chatRoomId as string, cls.name)}
                      className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        selectedClassId === cls.chatRoomId ? 'bg-gray-200 dark:bg-gray-700' : ''
                      }`}
                    >
                      <UserGroupIcon className="h-6 w-6 text-primary dark:text-primary-content" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-base-content dark:text-white">
                          {cls.name}
                        </h3>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-base-200 dark:border-gray-700">
              <h1 className="text-xl font-semibold text-base-content dark:text-white sm:text-2xl">
                {selectedClassName ? `${selectedClassName} Chat` : 'Teacher Chat'}
              </h1>
              <div className="flex items-center gap-2">
                <SendNotificationModal
                  trigger={
                    <button
                      title="Send Notification"
                      className="p-2 text-primary dark:text-primary-content hover:text-primary-focus dark:hover:text-primary-content transition-colors"
                    >
                      <MdOutlineNotificationsNone size={24} />
                    </button>
                  }
                />
              </div>
            </div>
            {error && (
              <div className="p-4">
                <div className="alert alert-error shadow-lg">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Error: {error}</span>
                  </div>
                </div>
              </div>
            )}
            {selectedClassId ? (
              <ChatWindow
                messages={messages}
                sendMessage={sendMessage}
                chatRoomId={selectedClassId}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                Please select a class to start chatting.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherChat;