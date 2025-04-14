import React from "react";
import { Message } from "../types/message";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
  return (
    <div
      className={`p-2 rounded-lg ${
        isOwnMessage ? "bg-blue-200 ml-auto" : "bg-gray-200"
      } max-w-xs`}
    >
      {message.content && <p>{message.content}</p>}
      {message.mediaUrl && message.mediaType === "image" && (
        <img src={message.mediaUrl} alt="Media" className="mt-2 max-w-full" />
      )}
      {message.mediaUrl && message.mediaType === "document" && (
        <a
          href={message.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 mt-2 block"
        >
          Download
        </a>
      )}
      <p className="text-xs text-gray-500">
        {new Date(message.createdAt).toLocaleTimeString()}
      </p>
    </div>
  );
};

export default MessageBubble;