import { Request, Response } from 'express';
import { IChatController } from './IChatController';
import { ISendMessageUseCase } from '../../../domain/useCase/ISendMessageUseCase';
import { IClassRepository } from '../../../domain/repositories/IClassRepository';
import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from '../../../domain/errors';
import { HttpStatus } from '../../../domain/types/enums';
import { Role } from '../../../domain/types/enums';

export class ChatController implements IChatController {
  constructor(
    private sendMessageUseCase: ISendMessageUseCase,
    private classRepository: IClassRepository
  ) {}

  async sendMessage(req: Request, res: Response) {
    try {
      const message = req.body;
      const user = req.user; // From authenticateUser middleware

      if (!message.chatRoomId || !message.senderId || !message.senderRole) {
        throw new ValidationError('Missing required message fields');
      }

      if (message.senderId !== user.id || message.senderRole !== user.role) {
        throw new UnauthorizedError('Unauthorized: Invalid sender');
      }

      if (user.role === Role.Student) {
        const isStudentInClass = await this.classRepository.isStudentInClass(
          user.id,
          message.chatRoomId
        );
        if (!isStudentInClass) {
          throw new ForbiddenError(
            'You are not authorized to send messages to this class group'
          );
        }
      }

      const savedMessage = await this.sendMessageUseCase.execute(message);
      res.status(HttpStatus.OK).json(savedMessage);
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else if (error instanceof UnauthorizedError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
      } else if (error instanceof ForbiddenError) {
        res.status(HttpStatus.FORBIDDEN).json({ error: error.message });
      } else if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: 'An unexpected error occurred' });
      }
    }
  }
}
