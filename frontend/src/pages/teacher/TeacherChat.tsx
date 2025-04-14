import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatWindow from "../../components/ChatWindow";
import { RootState, AppDispatch } from "../../redux/store";
import { SocketAdapter } from "../../adapters/socketAdapter";
import { ApiAdapter } from "../../adapters/apiAdapter";
import { SendMessage } from "../../useCases/sendMessage";
import { FetchMessages } from "../../useCases/fetchMessages";
import { addMessage, setMessages, setLoading, setError } from "../../redux/slices/chatSlice";
import TeacherSidebar from "../../components/TeacherSidebar";

const socketAdapter = new SocketAdapter("http://localhost:5000");
const apiAdapter = new ApiAdapter("http://localhost:5000/api");
const sendMessageUseCase = new SendMessage(socketAdapter);
const fetchMessagesUseCase = new FetchMessages(apiAdapter);

const TeacherChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading, error } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth.user);
  const chatRoomId = "class-123"; // Replace with dynamic room ID

  useEffect(() => {
    socketAdapter.connect();
    socketAdapter.joinRoom(chatRoomId);

    socketAdapter.onMessage((message) => {
      dispatch(addMessage(message));
    });

    socketAdapter.onError((err) => {
      dispatch(setError(err));
    });

    const fetchMessages = async () => {
      dispatch(setLoading(true));
      try {
        const fetchedMessages = await fetchMessagesUseCase.execute(chatRoomId);
        dispatch(setMessages(fetchedMessages));
      } catch (err: any) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchMessages();

    return () => {
      socketAdapter.disconnect();
    };
  }, [dispatch]);

  const handleSendMessage = (
    content: string,
    mediaUrl?: string,
    mediaType?: "image" | "document"
  ) => {
    sendMessageUseCase.execute({
      chatRoomId,
      senderId: user.id,
      senderRole: "teacher",
      content,
      mediaUrl,
      mediaType,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex-1 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Chat
        </h1>
        <ChatWindow
          messages={messages}
          sendMessage={handleSendMessage}
          chatRoomId={chatRoomId}
          isTeacher={true}
        />
      </div>
    </div>
  );
};

export default TeacherChat;