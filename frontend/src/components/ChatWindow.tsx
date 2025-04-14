import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import { Message } from "../types/Message";
import { RootState } from "../redux/store";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

interface ChatWindowProps {
  messages: Message[];
  sendMessage: (content: string, mediaUrl?: string, mediaType?: "image" | "document") => void;
  chatRoomId: string;
  isTeacher: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  sendMessage,
  chatRoomId,
  isTeacher,
}) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim() && !file) return;

    let mediaUrl: string | undefined;
    let mediaType: "image" | "document" | undefined;

    if (file && isTeacher) {
      mediaUrl = await uploadToCloudinary(file);
      if (!mediaUrl) throw new Error("Media upload failed");
      mediaType = file.type.startsWith("image/") ? "image" : "document";
      setFile(null);
    }

    sendMessage(content.trim(), mediaUrl, mediaType);
    setContent("");
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-lg shadow-sm">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === user.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        {isTeacher && (
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-2"
          />
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;