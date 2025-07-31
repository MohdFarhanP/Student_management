import mongoose from 'mongoose';
import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { Payment } from '../../domain/entities/Payment';
import { PaymentModel } from '../database/mongoos/models/PaymentModel';
import logger from '../../logger';

export class MongoPaymentRepository implements IPaymentRepository {
  async create(payment: Payment): Promise<void> {
    logger.debug(`studentId:, ${payment.getStudentId()}`);
    logger.debug(`feeDueId:, ${payment.getFeeDueId()}`);

    try {
      const paymentModel = new PaymentModel({
        studentId: payment.getStudentId(),
        feeDueId: payment.getFeeDueId(),
        amount: payment.getAmount(),
        paymentDate: payment.getPaymentDate(),
        paymentMethod: payment.getPaymentMethod(),
        transactionId: payment.getTransactionId(),
      });
      await paymentModel.save();
    } catch (error) {
      logger.error('error form payment repo', error);
      throw new Error(error);
    }
  }
}
