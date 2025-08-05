import { Request, Response } from 'express';
import { IPaymentController } from './IPaymentController';
import { HttpStatus } from '../../../../domain/types/enums';
import {
  IApiResponse,
  StudentFeeDue,
} from '../../../../domain/types/interfaces';
import { IPaymentUseCase } from '../../../../domain/useCase/IPaymentUseCase';

export class PaymentController implements IPaymentController {
  constructor(private paymentUseCase: IPaymentUseCase) {}

  async getPaymentStatuses(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const { duesDto, totalCount } = await this.paymentUseCase.exicute(
        page,
        limit
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully sent response',
        data: { duesDto, totalCount },
      } as IApiResponse<{ duesDto: StudentFeeDue[]; totalCount: number }>);
    } catch (error: any) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
}
