// interfaces/controllers/chatController.ts
import { Request, Response } from 'express';
import { IChatController } from '../../domain/interface/IChatController';
import { ISendMessageUseCase } from '../../domain/interface/ISendMessageUseCase';
import { AppError, ValidationError, UnauthorizedError } from '../../domain/errors';
import HttpStatus from '../../utils/httpStatus';

export class ChatController implements IChatController {
  constructor(private sendMessageUseCase: ISendMessageUseCase) {}

  async sendMessage(req: Request, res: Response) {
    try {
      const message = await this.sendMessageUseCase.execute(req.body);
      res.status(HttpStatus.OK).json(message);
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else if (error instanceof UnauthorizedError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
      } else if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An unexpected error occurred' });
      }
    }
  }
}
