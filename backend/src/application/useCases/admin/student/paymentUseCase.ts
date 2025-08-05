import { IStudentFeeDueRepository } from '../../../../domain/repositories/IStudentFeeDueRepository';
import { StudentFeeDue } from '../../../../domain/types/interfaces';
import { IPaymentUseCase } from '../../../../domain/useCase/IPaymentUseCase';

export class PaymentUseCase implements IPaymentUseCase {
  constructor(private studentFeeDueRepository: IStudentFeeDueRepository) {}

  async exicute(
    page: number,
    limit: number
  ): Promise<{ duesDto: StudentFeeDue[]; totalCount: number }> {
    const { studentFeeDue, totalCount } =
      await this.studentFeeDueRepository.findByLimit(page, limit);
    const duesDto = studentFeeDue.map((due) => ({
      id: due.getId(),
      studentId: due.getStudentId(),
      feeTitle: due.getFeeTitle(),
      month: due.getMonth(),
      dueDate: due.getDueDate().toISOString(),
      amount: due.getAmount(),
      isPaid: due.isPaidStatus(),
      paymentId: due.getPaymentId(),
    }));
    return { duesDto, totalCount };
  }
}
