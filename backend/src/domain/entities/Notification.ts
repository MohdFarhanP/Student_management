import { Role, RecipientType } from '../types/enums';

export class NotificationEntity {
  public readonly id: string;
  public readonly title: string;
  public readonly message: string;
  public readonly recipientType: RecipientType;
  public readonly recipientIds?: string[];
  public readonly senderId: string;
  public readonly senderRole: Role;
  public readonly isRead: boolean;
  public readonly sent: boolean;
  public readonly createdAt: Date;
  public readonly scheduledAt?: string;

  constructor(params: {
    id: string;
    title: string;
    message: string;
    recipientType: RecipientType;
    recipientIds?: string[];
    senderId: string;
    senderRole: Role;
    isRead: boolean;
    sent: boolean;
    createdAt: Date | string;
    scheduledAt?: string;
  }) {
    const {
      id,
      title,
      message,
      recipientType,
      recipientIds,
      senderId,
      senderRole,
      isRead,
      sent,
      createdAt,
      scheduledAt,
    } = params;

    if (!id || !title || !message || !senderId || !senderRole) {
      throw new Error('Missing required notification fields');
    }

    this.id = id;
    this.title = title;
    this.message = message;
    this.recipientType = recipientType;
    this.recipientIds = recipientIds;
    this.senderId = senderId;
    this.senderRole = senderRole;
    this.isRead = isRead;
    this.sent = sent;
    this.createdAt =
      createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.scheduledAt = scheduledAt;
  }
}
