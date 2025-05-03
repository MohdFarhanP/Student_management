import { INotification } from '../types/interfaces';
import { Role, RecipientType } from '../types/enums';

export class NotificationEntity implements INotification {
  id: string;
  title: string;
  message: string;
  recipientType: RecipientType;
  recipientIds?: string[];
  senderId: string;
  senderRole: Role;
  isRead: boolean;
  createdAt: Date;
  scheduledAt?: string;

  constructor(notification: INotification) {
    if (!notification.id || !notification.title || !notification.message || !notification.senderId || !notification.senderRole) {
      throw new Error('Missing required notification fields');
    }
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
    this.scheduledAt = notification.scheduledAt;
  }
}