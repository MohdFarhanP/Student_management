import { Attendance } from '../entities/attendance.js';

export interface IAttendanceRepository {
  save(attendance: Attendance): Promise<void>;
  findByClassDatePeriod(
    classId: string,
    date: Date,
    period: number
  ): Promise<Attendance | null>;
}
