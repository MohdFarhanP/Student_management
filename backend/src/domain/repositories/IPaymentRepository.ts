import { Payment } from '../entities/Payment';

export interface IPaymentRepository {
  create(payment: Payment): Promise<Payment>;
  isPaidDue(feeDueId: string): Promise<Payment>;
}
