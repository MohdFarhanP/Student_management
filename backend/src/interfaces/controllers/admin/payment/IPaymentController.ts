import { Request, Response } from 'express';

export interface IPaymentController {
  getPaymentStatuses(req: Request, res: Response): Promise<void>;
}
