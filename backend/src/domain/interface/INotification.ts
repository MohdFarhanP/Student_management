export interface INotification {
  id: string;
  title: string;
  message: string;
  recipientType: 'global' | 'role' | 'Student';
  recipientIds?: string[];
  senderId: string;
  senderRole: 'Admin' | 'Teacher';
  isRead: boolean;
  createdAt: Date;
}
