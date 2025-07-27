import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MessageBubble from './MessageBubble';
import { Message } from '../types/message';
import { RootState } from '../redux/store';
import { uploadToS3 } from '../services/UploadToS3';
import { MdAttachFile, MdSend } from 'react-icons/md';
import AddEmoji from './AddEmoji';
import { FaRegSmile } from "react-icons/fa";

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
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  sendMessage,
}) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim() && !file) return;

    let mediaUrl: string | undefined;
    let mediaType: MediaType | undefined;

    if (file) {
      try {
        const uploadResult = await uploadToS3(file);
        mediaUrl = uploadResult.fileUrl;
        if (!mediaUrl) {
          setUploadError('Upload failed: No file URL returned');
          return;
        }
        mediaType = file.type.startsWith('image/')
          ? MediaType.Image
          : MediaType.Document;
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!user)
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        Please log in to access the chat.
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-lg bg-white p-4 sm:h-[calc(100vh-14rem)] lg:h-[calc(100vh-10rem)] dark:bg-gray-800">
      {uploadError && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-500 dark:bg-red-900 dark:text-red-400">
          {uploadError}
        </div>
      )}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id || `${msg.chatRoomId}-${messages.indexOf(msg)}`}
            message={msg}
            isOwnMessage={msg.senderId === user.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4">
        {showEmojiPicker && <AddEmoji setContent={setContent} showEmojiPicker={showEmojiPicker}/>}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <MdAttachFile size={20} />
            </button>
            <button
              onClick={() =>setShowEmojiPicker(!showEmojiPicker)}
              className="absolute top-1/2 left-10 -translate-y-1/2 transform text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <FaRegSmile size={17} />
            </button>
            
            <input
              type="file"
              accept="image/*,application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown ={handleKeyPress}
              placeholder="Type a message..."
              className={`w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 pl-16`} 
            />
            
          </div>
          <button
            onClick={handleSend}
            className="rounded-lg bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <MdSend size={20} />
          </button>
        </div>

        {file && (
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Selected file: {file.name}
            <button
              onClick={() => setFile(null)}
              className="ml-2 text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
