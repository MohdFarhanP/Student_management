import { IMessage } from '../interface/IMessage.js';

export class MessageEntity implements IMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderRole: 'student' | 'teacher';
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'document';
  createdAt: Date;

  constructor(data: IMessage) {
    this.id = data.id;
    this.chatRoomId = data.chatRoomId;
    this.senderId = data.senderId;
    this.senderRole = data.senderRole;
    this.content = data.content;
    this.mediaUrl = data.mediaUrl;
    this.mediaType = data.mediaType;
    this.createdAt = data.createdAt;
  }
}
