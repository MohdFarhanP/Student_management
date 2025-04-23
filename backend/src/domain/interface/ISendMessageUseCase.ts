import { IMessage } from './IMessage';

export interface ISendMessageUseCase {
  execute(message: Omit<IMessage, 'id' | 'createdAt'>): Promise<IMessage>;
}