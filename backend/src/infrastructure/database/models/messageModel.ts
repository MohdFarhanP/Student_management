// infrastructure/database/models/messageModel.ts
import mongoose from 'mongoose';
import { IMessage } from '../../../domain/interface/IMessage';
import { Role, MediaType } from '../../../domain/types/enums';

const messageSchema = new mongoose.Schema<IMessage>({
  chatRoomId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderRole: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  content: { type: String },
  mediaUrl: { type: String },
  mediaType: {
    type: String,
    enum: Object.values(MediaType),
  },
  createdAt: { type: Date, default: Date.now },
});

messageSchema.index({ chatRoomId: 1, createdAt: 1 });

export const MessageModel = mongoose.model('Message', messageSchema);