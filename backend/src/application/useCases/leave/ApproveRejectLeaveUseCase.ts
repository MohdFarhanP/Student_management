import { ILeaveRepository } from '../../../domain/repositories/ILeaveRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISendNotificationUseCase } from '../../../domain/useCase/ISendNotificationUseCase';
import { Leave } from '../../../domain/types/interfaces';
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from '../../../domain/errors';
import { Role, LeaveStatus, RecipientType } from '../../../domain/types/enums';
import { IApproveRejectLeaveUseCase } from '../../../domain/useCase/IApproveRejectLeaveUseCase';
import { ApproveRejectLeaveDTO } from '../../dtos/leaveDtos';

export class ApproveRejectLeaveUseCase implements IApproveRejectLeaveUseCase {
  constructor(
    private leaveRepository: ILeaveRepository,
    private userRepository: IUserRepository,
    private notificationService: ISendNotificationUseCase
  ) {}

  async execute(dto: ApproveRejectLeaveDTO): Promise<Leave> {
    if (!dto.leaveId || !dto.teacherId || !dto.status) {
      throw new ValidationError(
        'Missing required fields: leaveId, teacherId, status'
      );
    }
    if (
      dto.status !== LeaveStatus.Approved &&
      dto.status !== LeaveStatus.Rejected
    ) {
      throw new ValidationError('Invalid status: must be Approved or Rejected');
    }

    const teacher = await this.userRepository.findById(dto.teacherId);
    if (!teacher) {
      throw new ValidationError('Teacher not found');
    }
    if (teacher.role !== Role.Teacher) {
      throw new UnauthorizedError('Only teachers can approve or reject leaves');
    }

    const leave = await this.leaveRepository.findById(dto.leaveId);
    if (!leave) {
      throw new ValidationError('Leave request not found');
    }
    if (leave.status !== LeaveStatus.Pending) {
      throw new ForbiddenError('Leave request is already processed');
    }

    const updatedLeave = await this.leaveRepository.update(dto.leaveId, {
      status: dto.status,
      updatedAt: new Date().toISOString(),
    });

    // Notify the student about the leave status update
    await this.notificationService.execute({
      title: `Leave ${dto.status}`,
      message: `Your leave request for ${leave.date} has been ${dto.status.toLowerCase()}`,
      senderId: dto.teacherId,
      senderRole: Role.Teacher,
      recipientType: RecipientType.Student,
      recipientIds: [leave.studentId],
      scheduledAt: new Date(),
    });

    return updatedLeave;
  }
}
