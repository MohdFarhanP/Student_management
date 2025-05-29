import { MessageEntity } from '../../../domain/entities/message';
import { IMessage } from '../../../domain/types/interfaces';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { MessageModel } from '../../database/mongoos/models/messageModel';
import {
  mapMediaType,
  mapRole,
} from '../../database/mongoos/helpers/enumMappers';

export class MessageRepository implements IMessageRepository {
  async save(message: Omit<IMessage, 'id' | 'createdAt'>): Promise<IMessage> {
    try {
      const doc = new MessageModel(message);
      const saved = await doc.save();
      return new MessageEntity({
        id: saved._id.toString(),
        chatRoomId: saved.chatRoomId,
        senderId: saved.senderId,
        senderRole: mapRole(saved.senderRole),
        content: saved.content,
        mediaUrl: saved.mediaUrl,
        mediaType: mapMediaType(saved.mediaType),
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
            senderRole: mapRole(doc.senderRole),
            content: doc.content,
            mediaUrl: doc.mediaUrl,
            mediaType: mapMediaType(doc.mediaType),
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
