import { IMessage } from './IMessage.js';

export interface IMessageRepository {
  save(message: IMessage): Promise<IMessage>;
  findByChatRoomId(chatRoomId: string): Promise<IMessage[]>;
}
