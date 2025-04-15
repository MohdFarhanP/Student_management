export interface IMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderRole: 'Student' | 'Teacher';
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'document';
  createdAt: Date;
}
