import { INotification } from '../../../domain/types/interfaces';
import { NotificationEntity } from '../../../domain/entities/Notification';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository';
import { NotificationModel } from '../../database/models/notificationModel';
import { SendNotificationDTO } from '../../../domain/types/interfaces';
import { ValidationError, NotFoundError } from '../../../domain/errors';
import { RecipientType } from '../../../domain/types/enums';

export class NotificationRepository implements INotificationRepository {
  async save(notification: SendNotificationDTO): Promise<INotification> {
    try {
      console.log('Saving notification with scheduledAt:', notification.scheduledAt);
      const doc = new NotificationModel({
        ...notification,
        scheduledAt: notification.scheduledAt
          ? new Date(notification.scheduledAt).toISOString()
          : undefined,
      });
      const saved = await doc.save();
      return new NotificationEntity({
        id: saved._id.toString(),
        title: saved.title,
        message: saved.message,
        recipientType: saved.recipientType,
        recipientIds: saved.recipientIds,
        senderId: saved.senderId,
        senderRole: saved.senderRole,
        isRead: saved.isRead,
        createdAt: saved.createdAt,
        scheduledAt: saved.scheduledAt,
      });
    } catch (error) {
      throw new ValidationError(
        `Failed to save notification: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findScheduled(currentTime: Date): Promise<INotification[]> {
    try {
      const utcCurrentTime = currentTime.toISOString();
      const docs = await NotificationModel.find({
        scheduledAt: { $lte: utcCurrentTime, $exists: true },
        isRead: false,
      }).sort({ scheduledAt: 1 });
      return docs.map(
        (doc) =>
          new NotificationEntity({
            id: doc._id.toString(),
            title: doc.title,
            message: doc.message,
            recipientType: doc.recipientType,
            recipientIds: doc.recipientIds,
            senderId: doc.senderId,
            senderRole: doc.senderRole,
            isRead: doc.isRead,
            createdAt: doc.createdAt,
            scheduledAt: doc.scheduledAt || undefined,
          })
      );
    } catch (error) {
      throw new ValidationError(
        `Failed to fetch scheduled notifications: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findByUserId(userId: string): Promise<INotification[]> {
    try {
      if (!userId) {
        throw new ValidationError('User ID is required');
      }
      const docs = await NotificationModel.find({
        $or: [
          { recipientType: RecipientType.Global },
          { recipientType: RecipientType.Role, recipientIds: userId },
          { recipientType: RecipientType.Student, recipientIds: userId },
        ],
      }).sort({ createdAt: -1 });
      return docs.map(
        (doc) =>
          new NotificationEntity({
            id: doc._id.toString(),
            title: doc.title,
            message: doc.message,
            recipientType: doc.recipientType,
            recipientIds: doc.recipientIds,
            senderId: doc.senderId,
            senderRole: doc.senderRole,
            isRead: doc.isRead,
            createdAt: doc.createdAt,
            scheduledAt: doc.scheduledAt || undefined,
          })
      );
    } catch (error) {
      throw new ValidationError(
        `Failed to fetch notifications: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const result = await NotificationModel.updateOne(
        { _id: notificationId, recipientIds: userId },
        { $set: { isRead: true } }
      );
      if (result.matchedCount === 0) {
        throw new NotFoundError('Notification not found or not accessible');
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new ValidationError(
        `Failed to mark notification as read: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}