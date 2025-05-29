import { IAttendanceRepository } from '../../../domain/repositories/IAttendanceRepository';
import { Attendance } from '../../../domain/entities/attendance';
import { IViewAttendanceUseCase } from '../../../domain/useCase/IViewAttendanceUseCase';
import { Types } from 'mongoose';

export class ViewAttendanceUseCase implements IViewAttendanceUseCase {
  constructor(private attendanceRepository: IAttendanceRepository) {}

  async execute(studentId: string): Promise<Attendance[]> {
    if (!studentId || !Types.ObjectId.isValid(studentId)) {
      throw new Error('Valid student ID is required');
    }
    return await this.attendanceRepository.findByStudentId(studentId);
  }
}
