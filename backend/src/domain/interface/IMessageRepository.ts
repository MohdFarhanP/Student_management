import { IMessage } from './IMessage.js';

export interface IMessageRepository {
  save(message: Omit<IMessage, 'id' | 'createdAt'>): Promise<IMessage>;
  findByChatRoomId(chatRoomId: string): Promise<IMessage[]>;
}
