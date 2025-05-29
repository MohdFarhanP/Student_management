import { ILeaveRepository } from '../../../domain/repositories/ILeaveRepository';
import { ISendNotificationUseCase } from '../../../domain/useCase/ISendNotificationUseCase';
import { Leave } from '../../../domain/types/interfaces';
import { ValidationError } from '../../../domain/errors';
import { Role, LeaveStatus, RecipientType } from '../../../domain/types/enums';
import { IApplyForLeaveUseCase } from '../../../domain/useCase/IApplyForLeaveUseCase';
import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';
import { ApplyForLeaveDTO } from '../../dtos/leaveDtos';

export class ApplyForLeaveUseCase implements IApplyForLeaveUseCase {
  constructor(
    private leaveRepository: ILeaveRepository,
    private studentRepository: IStudentRepository,
    private notificationService: ISendNotificationUseCase
  ) {}

  async execute(dto: ApplyForLeaveDTO): Promise<Leave> {
    if (!dto.studentId || !dto.date || !dto.reason) {
      throw new ValidationError(
        'Missing required fields: studentId, date, reason'
      );
    }

    const user = await this.studentRepository.findById(dto.studentId);
    if (!user) {
      throw new ValidationError('Student not found');
    }

    const leave: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'> = {
      studentId: dto.studentId,
      date: dto.date,
      reason: dto.reason,
      status: LeaveStatus.Pending,
    };

    const createdLeave = await this.leaveRepository.create(leave);

    // Notify teachers about the new leave application
    await this.notificationService.execute({
      title: 'New Leave Application',
      message: `New leave request from student ${user.name} for ${dto.date}`,
      senderId: dto.studentId,
      senderRole: Role.Student,
      recipientType: RecipientType.Role,
      recipientIds: [Role.Teacher],
      scheduledAt: new Date(),
    });

    return createdLeave;
  }
}
