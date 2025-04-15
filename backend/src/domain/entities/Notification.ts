import { INotification } from '../interface/INotification.js';

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

  constructor(data: INotification) {
    this.id = data.id;
    this.title = data.title;
    this.message = data.message;
    this.recipientType = data.recipientType;
    this.recipientIds = data.recipientIds;
    this.senderId = data.senderId;
    this.senderRole = data.senderRole;
    this.isRead = data.isRead;
    this.createdAt = data.createdAt;
  }
}
