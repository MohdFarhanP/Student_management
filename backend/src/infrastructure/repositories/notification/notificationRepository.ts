import { INotification } from '../../../domain/types/interfaces';
import { NotificationEntity } from '../../../domain/entities/Notification';
import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { NotificationModel } from '../../database/mongoos/models/notificationModel';
import { SendNotificationDTO } from '../../../application/dtos/notificationDtos';
import { ValidationError, NotFoundError } from '../../../domain/errors';
import { RecipientType } from '../../../domain/types/enums';
import {
  mapRecipientType,
  mapRole,
} from '../../database/mongoos/helpers/enumMappers';

export class NotificationRepository implements INotificationRepository {
  async save(notification: SendNotificationDTO): Promise<INotification> {
    try {
      if (
        notification.scheduledAt &&
        isNaN(new Date(notification.scheduledAt).getTime())
      ) {
        throw new ValidationError('Invalid scheduledAt format');
      }
      console.log(
        'Saving notification at server time (UTC):',
        new Date().toISOString()
      );
      console.log('Scheduled at (UTC):', notification.scheduledAt);
      const doc = new NotificationModel({
        ...notification,
        scheduledAt: notification.scheduledAt || undefined,
      });
      const saved = await doc.save();
      console.log(
        'Saved notification with createdAt (UTC):',
        saved.createdAt.toISOString()
      );
      return new NotificationEntity({
        id: saved._id.toString(),
        title: saved.title,
        message: saved.message,
        recipientType: mapRecipientType(doc.recipientType),
        recipientIds: saved.recipientIds,
        senderId: saved.senderId,
        senderRole: mapRole(doc.senderRole),
        isRead: saved.isRead,
        sent: saved.sent,
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
      console.log(
        `findScheduled querying for notifications with scheduledAt <= ${utcCurrentTime}, sent: false`
      );
      const docs = await NotificationModel.find({
        scheduledAt: { $lte: utcCurrentTime, $exists: true },
        sent: false,
      }).sort({ scheduledAt: 1 });
      console.log(`findScheduled found ${docs.length} notifications`);
      return docs.map(
        (doc) =>
          new NotificationEntity({
            id: doc._id.toString(),
            title: doc.title,
            message: doc.message,
            recipientType: mapRecipientType(doc.recipientType),
            recipientIds: doc.recipientIds,
            senderId: doc.senderId,
            senderRole: mapRole(doc.senderRole),
            isRead: doc.isRead,
            sent: doc.sent,
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

  async findByUserId(
    userId: string,
    userRole: string
  ): Promise<INotification[]> {
    try {
      if (!userId) {
        throw new ValidationError('User ID is required');
      }
      const filters: any[] = [{ recipientType: RecipientType.Global }];

      if (userRole === 'Teacher' || userRole === 'Admin') {
        filters.push({
          recipientType: RecipientType.Role,
          recipientIds: { $in: [userRole] },
        });
      }

      if (userRole === 'Student') {
        filters.push({
          recipientType: RecipientType.Student,
          recipientIds: { $in: [userId] },
        });
      }

      const docs = await NotificationModel.find({ $or: filters }).sort({
        createdAt: -1,
      });

      return docs.map(
        (doc) =>
          new NotificationEntity({
            id: doc._id.toString(),
            title: doc.title,
            message: doc.message,
            recipientType: mapRecipientType(doc.recipientType),
            recipientIds: doc.recipientIds,
            senderId: doc.senderId,
            senderRole: mapRole(doc.senderRole),
            isRead: doc.isRead,
            sent: doc.sent,
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

  async markAsSent(notificationId: string): Promise<void> {
    try {
      const result = await NotificationModel.updateOne(
        { _id: notificationId },
        { $set: { sent: true } }
      );
      if (result.matchedCount === 0) {
        throw new ValidationError('Notification not found');
      }
    } catch (error) {
      throw new ValidationError(
        `Failed to mark notification as sent: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async markAsRead(
    notificationId: string,
    userId: string,
    userRole: string
  ): Promise<void> {
    try {
      const notification = await NotificationModel.findById(notificationId);
      if (!notification) {
        throw new NotFoundError('Notification not found');
      }

      const isGlobal = notification.recipientType === 'global';
      const isIndividual =
        notification.recipientType === 'Student' &&
        notification.recipientIds.includes(userId);
      const isRoleBased =
        notification.recipientType === 'role' &&
        notification.recipientIds.includes(userRole);

      if (!isGlobal && !isIndividual && !isRoleBased) {
        throw new NotFoundError('Notification not accessible to this user');
      }

      const result = await NotificationModel.updateOne(
        { _id: notificationId },
        { $set: { isRead: true } }
      );

      if (result.matchedCount === 0) {
        throw new NotFoundError('Notification could not be updated');
      }
    } catch (error) {
      if (error instanceof NotFoundError) throw error;

      throw new ValidationError(
        `Failed to mark notification as read: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
