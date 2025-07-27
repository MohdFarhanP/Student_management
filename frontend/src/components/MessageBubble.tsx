import React from 'react';
import { Message } from '../types/message';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  return (
    <div
      className={`max-w-[70%] sm:max-w-[60%] p-3 rounded-lg ${
        isOwnMessage
          ? 'ml-auto bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
          : 'mr-auto bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
      }`}
    >
      {message.content && <p className="text-lg">{message.content}</p>}
      {message.mediaUrl && message.mediaType === 'image' && (
        <img
          src={message.mediaUrl}
          alt="Media"
          className="mt-2 max-w-full rounded-lg"
        />
      )}
      {message.mediaUrl && message.mediaType === 'document' && (
        <a
          href={message.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-blue-600 dark:text-blue-400 text-sm hover:underline"
        >
          Download Document
        </a>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {new Date(message.createdAt).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}
      </p>
    </div>
  );
};

export default MessageBubble;
