import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MessageBubble from './MessageBubble';
import { Message } from '../types/message';
import { RootState } from '../redux/store';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

interface ChatWindowProps {
  messages: Message[];
  sendMessage: (content: string, mediaUrl?: string, mediaType?: 'image' | 'document') => void;
  chatRoomId: string;
  isTeacher: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, sendMessage, isTeacher }) => {
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
    let mediaType: 'image' | 'document' | undefined;

    if (file && isTeacher) {
      try {
        mediaUrl = await uploadToCloudinary(file);
        if (!mediaUrl) {
          setUploadError('Upload failed');
          return;
        }
        mediaType = file.type.startsWith('image/') ? 'image' : 'document';
        setFile(null);
        setUploadError(null);
      } catch (error) {
        setUploadError('Failed to upload file: ' + (error instanceof Error ? error.message : 'Unknown error'));
        return;
      }
    }

    sendMessage(content.trim(), mediaUrl, mediaType);
    setContent('');
  };

  if (!user) return <div>Please log in to access the chat.</div>;

  return (
    <div className='flex flex-col h-[80vh] bg-white p-4'>
      {uploadError && <div className='text-red-500 mb-2'>{uploadError}</div>}
      <div className='flex-1 overflow-y-auto space-y-2'>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwnMessage={msg.senderId === user.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className='mt-4'>
        {isTeacher && (
          <input
            type='file'
            accept='image/*,application/pdf'
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className='mb-2'
          />
        )}
        <div className='flex gap-2'>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='Type a message...'
            className='flex-1 p-2 border'
          />
          <button onClick={handleSend} className='p-2 bg-blue-500 text-white'>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;