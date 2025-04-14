import { Attendance } from '../entities/attendance.js';

export interface IAttendanceRepository {
  save(attendance: Attendance): Promise<void>;
  findByStudentClassDatePeriod(
    classId: string,
    studentId: string,
    date: Date,
    period: number,
    day: string
  ): Promise<Attendance | null>;
  findByStudentId(studentId: string): Promise<Attendance[]>;
}
