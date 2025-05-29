import { IAttendanceRepository } from '../../../domain/repositories/IAttendanceRepository';
import { IFetchWeeklyAttendanceUseCase } from '../../../domain/useCase/IFetchWeeklyAttendanceUseCase';
import { AttendanceDataDto } from '../../dtos/attendanceDtos';

export class FetchWeeklyAttendanceUseCase
  implements IFetchWeeklyAttendanceUseCase
{
  constructor(private attendanceRepository: IAttendanceRepository) {}

  async execute(classId: string): Promise<AttendanceDataDto[]> {
    if (!classId) {
      throw new Error('Class ID is required');
    }
    return this.attendanceRepository.getWeeklyAttendance(classId);
  }
}
