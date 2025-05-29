import { IMessage } from '../types/interfaces';

export interface IMessageRepository {
  save(message: Omit<IMessage, 'id' | 'createdAt'>): Promise<IMessage>;
  findByChatRoomId(chatRoomId: string): Promise<IMessage[]>;
}
