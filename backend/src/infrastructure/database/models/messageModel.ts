import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatRoomId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderRole: { type: String, enum: ['student', 'teacher'], required: true },
  content: { type: String },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ['image', 'document'] },
  createdAt: { type: Date, default: Date.now },
});

messageSchema.index({ chatRoomId: 1, createdAt: 1 });

export const MessageModel = mongoose.model('Message', messageSchema);
