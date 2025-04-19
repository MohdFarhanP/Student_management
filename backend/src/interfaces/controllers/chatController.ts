import { Request, Response } from 'express';
import { SendMessage } from '../../application/useCases/message/sendMessage';
import { MessageRepository } from '../../infrastructure/repositories/message/messageRepository';

export class ChatController {
  private sendMessageUseCase: SendMessage;

  constructor() {
    this.sendMessageUseCase = new SendMessage(new MessageRepository());
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const message = await this.sendMessageUseCase.execute(req.body);
      res.json(message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
}
