export interface IMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderRole: 'student' | 'teacher';
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'document';
  createdAt: Date;
}
