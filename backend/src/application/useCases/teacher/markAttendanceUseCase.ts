import { IAttendanceRepository } from '../../../domain/interface/IAttendanceRepository';
import { Attendance } from '../../../domain/entities/attendance';
import { ITimetableService } from '../../../domain/interface/ITimetableService';
import { Types } from 'mongoose';
import { IMarkAttendanceUseCase } from '../../../domain/interface/IMarkAttendanceUseCase';
import { BadRequestError, UnauthorizedError } from '../../../domain/errors/index';

export class MarkAttendanceUseCase implements IMarkAttendanceUseCase {
  constructor(
    private attendanceRepository: IAttendanceRepository,
    private timetableService: ITimetableService
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
    if (!Types.ObjectId.isValid(classId)) {
      throw new BadRequestError('Invalid class ID format');
    }
    if (!Types.ObjectId.isValid(studentId)) {
      throw new BadRequestError('Invalid student ID format');
    }
    if (!Types.ObjectId.isValid(teacherId)) {
      throw new BadRequestError('Invalid teacher ID format');
    }

    const classIdObj = new Types.ObjectId(classId);
    const teacherIdObj = new Types.ObjectId(teacherId);

    const isAssigned = await this.timetableService.validateTeacherAssignment(
      classIdObj,
      day,
      period,
      teacherIdObj
    );
    if (!isAssigned) {
      throw new UnauthorizedError('Teacher not assigned to this period');
    }

    const existingAttendance = await this.attendanceRepository.findByStudentClassDatePeriod(
      classId,
      studentId,
      date,
      period,
      day
    );
    if (existingAttendance) {
      throw new BadRequestError('Attendance already marked for this student in this period');
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