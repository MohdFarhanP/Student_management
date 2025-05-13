import { ILeaveRepository } from '../../../domain/interface/ILeaveRepository';
import { IUserRepository } from '../../../domain/interface/IUserRepository';
import { Leave, ViewLeaveHistoryDTO } from '../../../domain/types/interfaces';
import { ValidationError, UnauthorizedError } from '../../../domain/errors';
import { Role } from '../../../domain/types/enums';
import { IViewLeaveHistoryUseCase } from '../../../domain/interface/IViewLeaveHistoryUseCase';

export class ViewLeaveHistoryUseCase implements IViewLeaveHistoryUseCase {
  constructor(
    private leaveRepository: ILeaveRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(dto: ViewLeaveHistoryDTO): Promise<Leave[]> {
    if (!dto.userId) {
      throw new ValidationError('Missing required field: userId');
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (!dto.studentId) {
      // Teacher requesting all pending leaves
      if (user.role !== Role.Teacher) {
        throw new UnauthorizedError('Only teachers can view pending leave requests');
      }
      const leave = await this.leaveRepository.findByStudentId('');
      return leave
    }

    // Student viewing their own leave history
    if (user.role !== Role.Student) {
      throw new UnauthorizedError('Only students can view their leave history');
    }
    if (dto.studentId !== dto.userId) {
      throw new UnauthorizedError('Students can only view their own leave history');
    }
    const le = this.leaveRepository.findByStudentId(dto.studentId);
    console.log('finded the history for students ', le);
    return le
  }
}