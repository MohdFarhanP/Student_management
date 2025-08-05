import { IPaymentGateway } from '../../services/IPaymentGateway';
import { IProcessPaymentUseCase } from '../../../domain/useCase/IProcessPaymentUseCase';
import { IStudentFeeDueRepository } from '../../../domain/repositories/IStudentFeeDueRepository';

export class ProcessPaymentUseCase implements IProcessPaymentUseCase {
  constructor(
    private studentFeeDueRepository: IStudentFeeDueRepository,
    private paymentGateway: IPaymentGateway
  ) {}

  async execute(studentId: string, feeDueId: string): Promise<string> {
    const isPaid = await this.studentFeeDueRepository.IsPaid(feeDueId);
    if (isPaid) {
      throw new Error('Fee due is already paid');
    }

    const feeDues =
      await this.studentFeeDueRepository.findUnpaidByStudentId(studentId);
    const feeDue = feeDues.find((due) => due.getId() === feeDueId);
    if (!feeDue) throw new Error('Fee due not found');

    const order = await this.paymentGateway.createOrder(
      feeDue.getAmount() * 100,
      `receipt_${feeDueId}`
    );
    return order.id;
  }
}
