import { IMessage } from '../types/interfaces';

export interface ISendMessageUseCase {
  execute(message: Omit<IMessage, 'id' | 'createdAt'>): Promise<IMessage>;
}
