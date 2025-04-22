import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus';
import { MarkAttendanceUseCase } from '../../../application/useCases/teacher/markAttendanceUseCase';
import { ViewAttendanceUseCase } from '../../../application/useCases/student/ViewAttendanceUseCase';
import { IAttendanceController } from '../../../domain/interface/teacher/IAttendanceController';
import { IApiResponse } from '../../../domain/types/interfaces';
import { Attendance } from '../../../domain/entities/attendance';
import { IUser } from '../../../domain/types/interfaces';
import mongoose from 'mongoose';

export class AttendanceController implements IAttendanceController {
  constructor(
    private markAttendanceUseCase: MarkAttendanceUseCase,
    private viewAttendanceUseCase: ViewAttendanceUseCase
  ) {}

  async markAttendance(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const { studentId, date, period, status, day } = req.body;
      const user = req.user as IUser | undefined;

      if (!user?.id || !mongoose.Types.ObjectId.isValid(user.id)) {
        throw new Error('Unauthorized: Valid teacher ID required');
      }
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid class ID format');
      }
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID format');
      }
      if (!['present', 'absent'].includes(status)) {
        throw new Error('Invalid status: Must be "present" or "absent"');
      }
      if (!Number.isInteger(period) || period < 1 || period > 6) {
        throw new Error('Invalid period: Must be an integer between 1 and 6');
      }
      if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)) {
        throw new Error('Invalid day: Must be Monday, Tuesday, Wednesday, Thursday, or Friday');
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
        user.id,
        day
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Attendance marked successfully',
      } as IApiResponse<never>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = message.includes('Unauthorized') || message.includes('Invalid')
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async viewAttendance(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const user = req.user as IUser | undefined;

      if (!user?.id || !mongoose.Types.ObjectId.isValid(user.id)) {
        throw new Error('Unauthorized: Valid teacher ID required');
      }
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID format');
      }

      const attendanceRecords = await this.viewAttendanceUseCase.execute(studentId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Attendance records fetched successfully',
        data: attendanceRecords,
      } as IApiResponse<Attendance[]>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = message.includes('Unauthorized') || message.includes('Invalid')
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
}