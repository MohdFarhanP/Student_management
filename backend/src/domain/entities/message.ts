import { MediaType, Role } from '../types/enums';

export class MessageEntity {
  readonly id: string;
  readonly chatRoomId: string;
  readonly senderId: string;
  readonly senderRole: Role;
  readonly content?: string;
  readonly mediaUrl?: string;
  readonly mediaType?: MediaType;
  readonly createdAt: Date;

  constructor(data: {
    id: string;
    chatRoomId: string;
    senderId: string;
    senderRole: Role;
    content?: string;
    mediaUrl?: string;
    mediaType?: MediaType;
    createdAt?: Date;
  }) {
    this.id = data.id;
    this.chatRoomId = data.chatRoomId;
    this.senderId = data.senderId;
    this.senderRole = data.senderRole;
    this.content = data.content;
    this.mediaUrl = data.mediaUrl;
    this.mediaType = data.mediaType;
    this.createdAt = data.createdAt ?? new Date();
  }
}
