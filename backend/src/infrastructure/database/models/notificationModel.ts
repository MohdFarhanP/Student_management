import mongoose from 'mongoose';
import { INotification } from '../../../domain/types/interfaces';
import { Role, RecipientType } from '../../../domain/types/enums';

const notificationSchema = new mongoose.Schema<INotification>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipientType: {
    type: String,
    enum: Object.values(RecipientType),
    required: true,
  },
  recipientIds: [{ type: String }],
  senderId: { type: String, required: true },
  senderRole: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  isRead: { type: Boolean, default: false },
  sent: { type: Boolean, default: false }, // Tracks if notification was emitted
  createdAt: { type: Date, default: Date.now },
  scheduledAt: { type: String },
});

notificationSchema.index({ recipientIds: 1, createdAt: -1 });
notificationSchema.index({ scheduledAt: 1, sent: 1 });

export const NotificationModel = mongoose.model<INotification>('Notification', notificationSchema);