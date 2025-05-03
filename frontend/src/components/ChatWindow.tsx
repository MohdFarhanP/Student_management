import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MessageBubble from './MessageBubble';
import { Message } from '../types/message';
import { RootState } from '../redux/store';
import { uploadToS3 } from '../services/UploadToS3';

enum MediaType {
  Image = 'image',
  Document = 'document',
}

interface ChatWindowProps {
  messages: Message[];
  sendMessage: (
    content: string,
    mediaUrl?: string,
    mediaType?: MediaType
  ) => void;
  chatRoomId?: string;
  isTeacher: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  sendMessage,
  isTeacher,
}) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim() && !file) return;

    let mediaUrl: string | undefined;
    let mediaType: MediaType | undefined;

    if (file && isTeacher) {
      try {
        const uploadResult = await uploadToS3(file); 
        mediaUrl = uploadResult.fileUrl; 
        if (!mediaUrl) {
          setUploadError('Upload failed: No file URL returned');
          return;
        }
        mediaType = file.type.startsWith('image/') ? MediaType.Image : MediaType.Document;
        setFile(null);
        setUploadError(null);
      } catch (error) {
        setUploadError(
          'Failed to upload file: ' +
            (error instanceof Error ? error.message : 'Unknown error')
        );
        return;
      }
    }

    sendMessage(content.trim(), mediaUrl, mediaType);
    setContent('');
    setFile(null);
  };

  if (!user) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Please log in to access the chat.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-14rem)] lg:h-[calc(100vh-10rem)] bg-white dark:bg-gray-800 p-4 rounded-lg">
      {uploadError && (
        <div className="mb-4 text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900 p-3 rounded-lg text-sm">
          {uploadError}
        </div>
      )}
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwnMessage={msg.senderId === user.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4">
        {isTeacher && (
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-3 text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-100 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-200 dark:hover:file:bg-blue-800"
          />
        )}
        <div className="flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="rounded-lg bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;