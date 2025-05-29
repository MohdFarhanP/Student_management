import { Attendance } from '../entities/attendance';
import { AttendanceDataDto } from '../../application/dtos/attendanceDtos';

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
  getWeeklyAttendance(classId: string): Promise<AttendanceDataDto[]>;
}
