import { Request, Response } from 'express';
import { IStudentFeeDueRepository } from '../../../../domain/repositories/IStudentFeeDueRepository';
import { IPaymentController } from './IPaymentController';
import { HttpStatus } from '../../../../domain/types/enums';
import { IApiResponse } from '../../../../domain/types/interfaces';

export class PaymentController implements IPaymentController {
  constructor(private studentFeeDueRepository: IStudentFeeDueRepository) {}

  async getPaymentStatuses(req: Request, res: Response): Promise<void> {
    try {
      const dues = await this.studentFeeDueRepository.findAll();
      const duesDto = dues.map((due) => ({
        id: due.getId(),
        studentId: due.getStudentId(),
        feeTitle: due.getFeeTitle(),
        month: due.getMonth(),
        dueDate: due.getDueDate().toISOString(),
        amount: due.getAmount(),
        isPaid: due.isPaidStatus(),
        paymentId: due.getPaymentId(),
      }));
      res.status(200).json({
        success: true,
        message: 'Successfully sent response',
        data: duesDto,
      } as IApiResponse<typeof duesDto>);
    } catch (error: any) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
}
