import mongoose from 'mongoose';
import { INotification } from '../../../domain/interface/INotification';

const notificationSchema = new mongoose.Schema<INotification>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipientType: {
    type: String,
    enum: ['global', 'role', 'Student'],
    required: true,
  },
  recipientIds: [{ type: String }], // Optional array of user IDs or roles
  senderId: { type: String, required: true },
  senderRole: { type: String, enum: ['Admin', 'Teacher'], required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  scheduledAt: { type: String },
});

notificationSchema.index({ recipientIds: 1, createdAt: -1 });
notificationSchema.index({ scheduledAt: 1 });

export const NotificationModel = mongoose.model<INotification>(
  'Notification',
  notificationSchema
);
