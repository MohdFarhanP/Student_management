import { IAttendanceRepository } from '../../../domain/interface/IAttendanceRepository';
import { Attendance } from '../../../domain/entities/attendance';
import ManageTimetable from '../../../infrastructure/services/ManageTimetable';
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

    const isAssigned = await this.manageTimetable.validateTeacherAssignment(
      classIdObj,
      day,
      period,
      teacherIdObj
    );
    if (!isAssigned) {
      throw new Error('You are not assigned to this period');
    }

    const existingAttendanceStd =
      await this.attendanceRepository.findByStudentClassDatePeriod(
        classId,
        studentId,
        date,
        period,
        day
      );
    if (existingAttendanceStd) {
      throw new Error(
        'Attendance already marked for this student in this period'
      );
    }

    const attendance = Attendance.create({
      classId,
      studentId,
      date,
      period,
      status,
      day,
      createdBy: teacherId,
    });
    await this.attendanceRepository.save(attendance);
  }
}
