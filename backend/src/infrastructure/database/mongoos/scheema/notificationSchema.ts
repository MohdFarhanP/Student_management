import mongoose from 'mongoose';
import { INotificationModel } from '../interface/INotificationModel';

export const notificationSchema = new mongoose.Schema<INotificationModel>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipientType: {
    type: String,
    enum: ['global', 'role', 'Student'],
    required: true,
  },
  recipientIds: [{ type: String }],
  senderId: { type: String, required: true },
  senderRole: {
    type: String,
    enum: ['Admin', 'Student', 'Teacher'],
    required: true,
  },
  isRead: { type: Boolean, default: false },
  sent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  scheduledAt: { type: String },
});

notificationSchema.index({ recipientIds: 1, createdAt: -1 });
notificationSchema.index({ scheduledAt: 1, sent: 1 });
