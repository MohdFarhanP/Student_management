import { IMessage } from './IMessage';

export interface IMessageRepository {
  save(message: Omit<IMessage, 'id' | 'createdAt'>): Promise<IMessage>;
  findByChatRoomId(chatRoomId: string): Promise<IMessage[]>;
}
