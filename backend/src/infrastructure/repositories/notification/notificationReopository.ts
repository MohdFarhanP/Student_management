import { INotification } from '../../../domain/interface/INotification';
import { NotificationEntity } from '../../../domain/entities/Notification';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository';
import { NotificationModel } from '../../database/models/notificationModel';
import { SendNotificationDTO } from '../../database/socketServer';

export class NotificationRepository implements INotificationRepository {
  async save(notification: SendNotificationDTO): Promise<INotification> {
    try {
      const doc = new NotificationModel(notification);
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
      });
    } catch (error) {
      throw new Error(
        `Failed to save notification: ${error instanceof Error ? error.message : 'Unknown error'}`
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
        { _id: notificationId, recipientIds: userId },
        { $set: { isRead: true } }
      );
    } catch (error) {
      throw new Error(
        `Failed to mark notification as read: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
