import mongoose from 'mongoose';
import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { Payment } from '../../domain/entities/Payment';
import { PaymentModel } from '../database/mongoos/models/PaymentModel';

export class MongoPaymentRepository implements IPaymentRepository {
  async create(payment: Payment): Promise<void> {
    console.log('studentId:', payment.getStudentId());
    console.log('feeDueId:', payment.getFeeDueId());

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
      console.error('error form payment repo', error);
      throw new Error(error);
    }
  }
}
