import mongoose from 'mongoose';
import { INotificationModel } from '../interface/INotificationModel';
import { notificationSchema } from '../scheema/notificationSchema';

export const NotificationModel = mongoose.model<INotificationModel>(
  'Notification',
  notificationSchema
);
