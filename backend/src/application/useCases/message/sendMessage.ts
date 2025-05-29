import { IMessage } from '../../../domain/types/interfaces';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { ISendMessageUseCase } from '../../../domain/useCase/ISendMessageUseCase';
import { ValidationError } from '../../../domain/errors';

export class SendMessage implements ISendMessageUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(
    message: Omit<IMessage, 'id' | 'createdAt'>
  ): Promise<IMessage> {
    if (!message.chatRoomId || !message.senderId || !message.senderRole) {
      throw new ValidationError('Missing required message fields');
    }
    return await this.messageRepository.save(message);
  }
}
