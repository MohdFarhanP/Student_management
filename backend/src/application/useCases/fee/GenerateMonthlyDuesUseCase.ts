import { StudentFeeDue } from '../../../domain/entities/StudentFeeDue';
import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';
import { IGenerateMonthlyDuesUseCase } from '../../../domain/useCase/IGenerateMonthlyDuesUseCase';
import { IRecurringFeeRepository } from '../../../domain/repositories/IRecurringFeeRepository';
import { ISendNotificationUseCase } from '../../../domain/useCase/ISendNotificationUseCase';
import { IStudentFeeDueRepository } from '../../../domain/repositories/IStudentFeeDueRepository';
import { RecipientType, Role } from '../../../domain/types/enums';

export class GenerateMonthlyDuesUseCase implements IGenerateMonthlyDuesUseCase {
  constructor(
    private recurringFeeRepository: IRecurringFeeRepository,
    private studentRepository: IStudentRepository,
    private studentFeeDueRepository: IStudentFeeDueRepository,
    private sendNotificationUseCase: ISendNotificationUseCase,
    private senderId: string
  ) {}

  async execute(currentMonth: string): Promise<void> {
    const currentDate = new Date(currentMonth);
    const fees = await this.recurringFeeRepository.findActiveFees(currentMonth);

    for (const fee of fees) {
      if (!fee.isActiveForMonth(currentMonth)) continue;

      const students = await this.studentRepository.getStudentsByClass(
        fee.getClassId()
      );
      const dues: StudentFeeDue[] = students.map((student) => {
        const dueDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        return new StudentFeeDue(
          new Date().getTime().toString(), // Temporary ID
          student.id,
          fee.getTitle(),
          currentMonth,
          dueDate,
          fee.getAmount()
        );
      });
      await this.studentFeeDueRepository.createMany(dues);

      for (const due of dues) {
        await this.sendNotificationUseCase.execute({
          title: `Monthly Fee Due - ${fee.getTitle()}`,
          message: `Dear Student, your fee of ₹${due.getAmount()} for ${due.getFeeTitle()} is due by ${due.getDueDate().toDateString()}.`,
          senderId: this.senderId,
          senderRole: Role.Admin,
          recipientType: RecipientType.Student,
          recipientIds: [due.getStudentId()],
          scheduledAt: new Date(),
        });
      }
    }
  }
}
