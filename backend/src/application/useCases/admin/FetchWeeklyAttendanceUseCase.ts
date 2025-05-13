import { IAttendanceRepository } from '../../../domain/interface/IAttendanceRepository';
import { IFetchWeeklyAttendanceUseCase } from '../../../domain/interface/IFetchWeeklyAttendanceUseCase';
import { AttendanceDataDto } from '../../../domain/types/interfaces';

export class FetchWeeklyAttendanceUseCase implements IFetchWeeklyAttendanceUseCase {
  constructor(private attendanceRepository: IAttendanceRepository) {}

  async execute(classId: string): Promise<AttendanceDataDto[]> {
    if (!classId) {
      throw new Error('Class ID is required');
    }
    return this.attendanceRepository.getWeeklyAttendance(classId);
  }
}