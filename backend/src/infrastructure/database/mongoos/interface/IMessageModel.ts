import { Document } from 'mongoose';

export interface IMessageModel extends Document {
  chatRoomId: string;
  senderId: string;
  senderRole: 'Admin' | 'Student' | 'Teacher';
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'document';
  createdAt: Date;
}
