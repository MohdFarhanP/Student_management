import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus.js';
import { MarkAttendanceUseCase } from '../../../application/useCases/teacher/markAttendanceUseCase.js';
import { AttendanceRepository } from '../../../infrastructure/repositories/teacher/attendanceRepository.js';
import ManageTimetable from '../../../infrastructure/services/ManageTimetable.js';
import TimetableRepository from '../../../infrastructure/repositories/admin/timeTableRepository.js';
import { TeacherRepository } from '../../../infrastructure/repositories/admin/teacherRepository.js';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export class AttendanceController {
  private markAttendanceUseCase: MarkAttendanceUseCase;

  constructor() {
    const attendanceRepository = new AttendanceRepository();
    const timetableRepository = new TimetableRepository();
    const teacherRepository = new TeacherRepository();
    const manageTimetable = new ManageTimetable(
      timetableRepository,
      teacherRepository
    );
    this.markAttendanceUseCase = new MarkAttendanceUseCase(
      attendanceRepository,
      manageTimetable
    );
  }

  async markAttendance(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const { classId } = req.params;
    const { studentId, date, period, status, day } = req.body;
    const teacherId = (req.user as { id: string }).id;

    try {
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid classId format');
      }
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid studentId format');
      }
      if (!['present', 'absent'].includes(status)) {
        throw new Error('Invalid status. Must be "present" or "absent"');
      }
      if (!period || !Number.isInteger(period) || period < 1 || period > 6) {
        throw new Error('Invalid period. Must be an integer between 1 and 6');
      }
      if (
        !day ||
        !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)
      ) {
        throw new Error(
          'Invalid day. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday'
        );
      }
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }

      await this.markAttendanceUseCase.execute(
        classId,
        studentId,
        parsedDate,
        period,
        status,
        teacherId,
        day
      );
      res
        .status(HttpStatus.OK)
        .json({ message: 'Attendance marked successfully' });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        return;
      }
    }
  }
}
