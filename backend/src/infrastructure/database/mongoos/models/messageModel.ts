import mongoose from 'mongoose';
import { messageSchema } from '../scheema/messageSchema';

export const MessageModel = mongoose.model('Message', messageSchema);
