import { INotification } from '../../../domain/interface/INotification';
import { NotificationEntity } from '../../../domain/entities/Notification';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository';
import { NotificationModel } from '../../database/models/notificationModel';
import { SendNotificationDTO } from '../../database/socketServer';

export class NotificationRepository implements INotificationRepository {
  
  async save(notification: SendNotificationDTO): Promise<INotification> {
    try {
      console.log('Saving notification with scheduledAt:', notification.scheduledAt);
      const doc = new NotificationModel({
        ...notification,
        scheduledAt: notification.scheduledAt
          ? new Date(notification.scheduledAt)
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
        scheduledAt: saved.scheduledAt ? saved.scheduledAt : undefined, 
      });
    } catch (error) {
      throw new Error(
        `Failed to save notification: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findScheduled(currentTime: Date): Promise<INotification[]> {
    try {
      const utcCurrentTime = new Date(currentTime.toISOString()); // Normalize to UTC
      console.log('Checking scheduled notifications at:', utcCurrentTime);
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
            scheduledAt: doc.scheduledAt ? doc.scheduledAt : undefined, // Ensure ISO string
          })
      );
    } catch (error) {
      throw new Error(
        `Failed to fetch scheduled notifications: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findByUserId(userId: string): Promise<INotification[]> {
    try {
      const docs = await NotificationModel.find({
        $or: [
          { recipientType: 'global' },
          { recipientType: 'role', recipientIds: userId },
          { recipientType: 'Student', recipientIds: userId },
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
            scheduledAt: doc.scheduledAt ? doc.scheduledAt : undefined,
          })
      );
    } catch (error) {
      throw new Error(
        `Failed to fetch notifications: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      await NotificationModel.updateOne(
        { _id: notificationId },
        { $set: { isRead: true } }
      );
    } catch (error) {
      throw new Error(
        `Failed to mark notification as read: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}