import { INotification } from '../interface/INotification';

export class NotificationEntity implements INotification {
  id: string;
  title: string;
  message: string;
  recipientType: 'global' | 'role' | 'Student';
  recipientIds?: string[];
  senderId: string;
  senderRole: 'Admin' | 'Teacher';
  isRead: boolean;
  createdAt: Date;
  scheduledAt?: string;

  constructor(notification: INotification) {
    this.id = notification.id;
    this.title = notification.title;
    this.message = notification.message;
    this.recipientType = notification.recipientType;
    this.recipientIds = notification.recipientIds;
    this.senderId = notification.senderId;
    this.senderRole = notification.senderRole;
    this.isRead = notification.isRead;
    this.createdAt = notification.createdAt instanceof Date
      ? notification.createdAt
      : new Date(notification.createdAt);
    this.scheduledAt = notification.scheduledAt; // Should be string or undefined
    console.log('NotificationEntity created with scheduledAt:', this.scheduledAt); // Debug log
  }
}