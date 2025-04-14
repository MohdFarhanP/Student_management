import { MessageEntity } from '../../../domain/entities/message.js';
import { IMessage } from '../../../domain/interface/IMessage.js';
import { IMessageRepository } from '../../../domain/interface/IMessageRepository.js';
import { MessageModel } from '../../database/models/messageModel.js';

export class MessageRepository implements IMessageRepository {
  async save(message: Omit<IMessage, 'id' | 'createdAt'>): Promise<IMessage> {
    try {
      const doc = new MessageModel(message);
      const saved = await doc.save();
      return new MessageEntity({
        id: saved._id.toString(),
        chatRoomId: saved.chatRoomId,
        senderId: saved.senderId,
        senderRole: saved.senderRole,
        content: saved.content,
        mediaUrl: saved.mediaUrl,
        mediaType: saved.mediaType,
        createdAt: saved.createdAt,
      });
    } catch (error) {
      throw new Error(
        'Failed to save message: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  async findByChatRoomId(chatRoomId: string): Promise<IMessage[]> {
    try {
      const docs = await MessageModel.find({ chatRoomId }).sort({
        createdAt: 1,
      });
      return docs.map(
        (doc) =>
          new MessageEntity({
            id: doc._id.toString(),
            chatRoomId: doc.chatRoomId,
            senderId: doc.senderId,
            senderRole: doc.senderRole,
            content: doc.content,
            mediaUrl: doc.mediaUrl,
            mediaType: doc.mediaType,
            createdAt: doc.createdAt,
          })
      );
    } catch (error) {
      throw new Error(
        'Failed to fetch messages: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }
}
