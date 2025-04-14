import { IAttendanceRepository } from '../../../domain/interface/IAttendanceRepository.js';
import { Attendance } from '../../../domain/entities/attendance.js';

export class ViewAttendanceUseCase {
  constructor(private attendanceRepository: IAttendanceRepository) {}

  async execute(studentId: string): Promise<Attendance[]> {
    if (!studentId) {
      throw new Error('Student ID is required');
    }
    return await this.attendanceRepository.findByStudentId(studentId);
  }
}
