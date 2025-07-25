import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/types/enums';
import { IRecurringFeeRepository } from '../../../../domain/repositories/IRecurringFeeRepository';
import { RecurringFee } from '../../../../domain/entities/RecurringFee';
import { IApiResponse } from '../../../../domain/types/interfaces';
import { IRecurringFeeController } from './IRecurringFeeController';
import { IRecurringFeeDto } from '../../../../application/dtos/feeDtos';
import logger from '../../../../logger';

export class RecurringFeeController implements IRecurringFeeController {
  constructor(private recurringFeeRepository: IRecurringFeeRepository) {}

  async createRecurringFee(req: Request, res: Response): Promise<void> {
    try {
      const { title, amount, startMonth, endMonth, classId, recurring } =
        req.body;

      // Validate request data
      if (!title || !amount || !startMonth || !classId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Missing required fields',
        } as IApiResponse<never>);
        return;
      }

      const fee = new RecurringFee(
        new Date().getTime().toString(),
        title,
        amount,
        startMonth,
        classId,
        recurring ?? true,
        endMonth
      );

      await this.recurringFeeRepository.create(fee);

      const payload = {
        id: fee.getId(),
        title: fee.getTitle(),
        amount: fee.getAmount(),
        startMonth: fee.getStartMonth(),
        endMonth: fee.getEndMonth(),
        classId: fee.getClassId(),
        recurring: fee.isRecurring(),
      };

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Successfully sent response',
        data: payload,
      } as IApiResponse<typeof payload>);
    } catch (error: any) {
      logger.error('Error creating recurring fee:', error);

      const message =
        error instanceof Error ? error.message : 'Internal server error';
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async getAllRecurringFees(req: Request, res: Response): Promise<void> {
    try {
      const fees = await this.recurringFeeRepository.findAll();
      const feesDto = fees.map((fee) => ({
        id: fee.getId(),
        title: fee.getTitle(),
        amount: fee.getAmount(),
        startMonth: fee.getStartMonth(),
        endMonth: fee.getEndMonth(),
        classId: fee.getClassId(),
        className: fee.getClassName(),
        recurring: fee.isRecurring(),
      }));

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Successfully sent response',
        data: feesDto,
      } as IApiResponse<IRecurringFeeDto[]>);
    } catch (error: any) {
      logger.error('Error creating recurring fee:', error);

      const message =
        error instanceof Error ? error.message : 'Internal server error';
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
}
