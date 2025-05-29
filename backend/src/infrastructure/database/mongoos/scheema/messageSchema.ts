import mongoose from 'mongoose';
import { IMessageModel } from '../interface/IMessageModel';

export const messageSchema = new mongoose.Schema<IMessageModel>({
  chatRoomId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderRole: {
    type: String,
    enum: ['Admin', 'Student', 'Teacher'],
    required: true,
  },
  content: { type: String },
  mediaUrl: { type: String },
  mediaType: {
    type: String,
    enum: ['image', 'document'],
  },
  createdAt: { type: Date, default: Date.now },
});

messageSchema.index({ chatRoomId: 1, createdAt: 1 });
