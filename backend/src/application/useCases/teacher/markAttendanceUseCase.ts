import { IAttendanceRepository } from '../../../domain/interface/IAttendanceRepository.js';
import { Attendance } from '../../../domain/entities/attendance.js';
import ManageTimetable from '../../../infrastructure/services/ManageTimetable.js';
import { Types } from 'mongoose';

export class MarkAttendanceUseCase {
  constructor(
    private attendanceRepository: IAttendanceRepository,
    private manageTimetable: ManageTimetable
  ) {}

  async execute(
    classId: string,
    studentId: string,
    date: Date,
    period: number,
    status: 'present' | 'absent',
    teacherId: string,
    day: string
  ): Promise<void> {
    const classIdObj = new Types.ObjectId(classId);
    const teacherIdObj = new Types.ObjectId(teacherId);

    // Use validateTeacherAssignment for reliable validation
    const isAssigned = await this.manageTimetable.validateTeacherAssignment(
      classIdObj,
      day,
      period,
      teacherIdObj
    );
    if (!isAssigned) {
      throw new Error('You are not assigned to this period');
    }

    // Check for existing attendance for the same period
    const existingAttendance =
      await this.attendanceRepository.findByClassDatePeriod(
        classId,
        date,
        period
      );
    if (existingAttendance) {
      throw new Error('Attendance already marked for this period');
    }

    const attendance = Attendance.create({
      classId,
      studentId,
      date,
      period,
      status,
      createdBy: teacherId,
    });
    await this.attendanceRepository.save(attendance);
  }
}
