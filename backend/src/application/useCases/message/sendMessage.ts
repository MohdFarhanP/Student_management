import { IMessage } from '../../../domain/interface/IMessage.js';
import { IMessageRepository } from '../../../domain/interface/IMessageRepository.js';

export class SendMessage {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(
    message: Omit<IMessage, 'id' | 'createdAt'>
  ): Promise<IMessage> {
    if (!message.chatRoomId || !message.senderId || !message.senderRole) {
      throw new Error('Missing required message fields');
    }
    return await this.messageRepository.save(message);
  }
}
