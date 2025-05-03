import { IMessage } from '../types/interfaces';
import { MediaType, Role } from '../types/enums';

export class MessageEntity implements IMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderRole: Role;
  content?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  createdAt: Date;

  constructor(data: IMessage) {
    if (!data.id || !data.chatRoomId || !data.senderId || !data.senderRole) {
      throw new Error('Missing required message fields');
    }
    this.id = data.id;
    this.chatRoomId = data.chatRoomId;
    this.senderId = data.senderId;
    this.senderRole = data.senderRole;
    this.content = data.content;
    this.mediaUrl = data.mediaUrl;
    this.mediaType = data.mediaType;
    this.createdAt = data.createdAt || new Date();
  }
}