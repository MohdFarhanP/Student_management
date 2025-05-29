import { Document } from 'mongoose';

export interface INotificationModel extends Document {
  title: string;
  message: string;
  recipientType: 'global' | 'role' | 'Student';
  recipientIds: string[];
  senderId: string;
  senderRole: 'Admin' | 'Student' | 'Teacher';
  isRead: boolean;
  sent: boolean;
  createdAt: Date;
  scheduledAt?: string;
}
