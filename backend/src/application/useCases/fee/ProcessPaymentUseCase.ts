import { Payment } from '../../../domain/entities/Payment';
import { IPaymentGateway } from '../../services/IPaymentGateway';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IProcessPaymentUseCase } from '../../../domain/useCase/IProcessPaymentUseCase';
import { IStudentFeeDueRepository } from '../../../domain/repositories/IStudentFeeDueRepository';

export class ProcessPaymentUseCase implements IProcessPaymentUseCase {
  constructor(
    private studentFeeDueRepository: IStudentFeeDueRepository,
    private paymentRepository: IPaymentRepository,
    private paymentGateway: IPaymentGateway
  ) {}

  async execute(
    studentId: string,
    feeDueId: string
  ): Promise<{ order: { id: string }; paymentId: string }> {
    const feeDues =
      await this.studentFeeDueRepository.findUnpaidByStudentId(studentId);
    const feeDue = feeDues.find((due) => due.getId() === feeDueId);
    if (!feeDue) throw new Error('Fee due not found');

    const order = await this.paymentGateway.createOrder(
      feeDue.getAmount() * 100,
      `receipt_${feeDueId}`
    );

    const payment = new Payment(
      new Date().getTime().toString(), // Temporary ID
      studentId,
      feeDueId,
      feeDue.getAmount(),
      new Date(),
      'Razorpay',
      order.id
    );
    await this.paymentRepository.create(payment);

    feeDue.markAsPaid(payment.getId());
    await this.studentFeeDueRepository.update(feeDue);

    return { order, paymentId: payment.getId() };
  }
}
