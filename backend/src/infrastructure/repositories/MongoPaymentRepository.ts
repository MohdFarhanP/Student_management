import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { Payment } from '../../domain/entities/Payment';
import { PaymentModel } from '../database/mongoos/models/PaymentModel';
import logger from '../../logger';

export class MongoPaymentRepository implements IPaymentRepository {
  async create(payment: Payment): Promise<Payment> {
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
      return new Payment(
        paymentModel._id.toString(),
        paymentModel.studentId.toString(),
        paymentModel.feeDueId.toString(),
        paymentModel.amount,
        paymentModel.paymentDate,
        paymentModel.paymentMethod,
        paymentModel.transactionId
      );
    } catch (error) {
      logger.error('error form payment repo', error);
      throw new Error(error);
    }
  }
  async isPaidDue(feeDueId: string): Promise<Payment> {
    try {
      const result = await PaymentModel.findOne({ feeDueId }).lean();
      return new Payment(
        result._id.toString(),
        result.studentId.toString(),
        result.feeDueId.toString(),
        result.amount,
        result.paymentDate,
        result.paymentMethod,
        result.transactionId
      );
    } catch (error) {
      logger.error('error form payment repo', error);
      throw new Error(error);
    }
  }
}
