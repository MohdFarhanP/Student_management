import { Request, Response } from 'express';
import { HttpStatus } from '../../../domain/types/enums';
import { IAttendanceController } from './IAttendanceController';
import { IApiResponse } from '../../../domain/types/interfaces';
import { Attendance } from '../../../domain/entities/attendance';
import { IUser } from '../../../domain/types/interfaces';
import mongoose from 'mongoose';
import { IGetRecentSessionAttendanceUseCase } from '../../../domain/useCase/IGetRecentSessionAttendanceUseCase';
import { IViewAttendanceUseCase } from '../../../domain/useCase/IViewAttendanceUseCase';
import { IMarkAttendanceUseCase } from '../../../domain/useCase/IMarkAttendanceUseCase';
import { SessionAttendanceDTO } from '../../../application/dtos/liveSessionDtos';

export class AttendanceController implements IAttendanceController {
  constructor(
    private markAttendanceUseCase: IMarkAttendanceUseCase,
    private viewAttendanceUseCase: IViewAttendanceUseCase,
    private getRecentSessionAttendanceUseCase: IGetRecentSessionAttendanceUseCase
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
      if (
        !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)
      ) {
        throw new Error(
          'Invalid day: Must be Monday, Tuesday, Wednesday, Thursday, or Friday'
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
        user.id,
        day
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Attendance marked successfully',
      } as IApiResponse<never>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status =
        message.includes('Unauthorized') || message.includes('Invalid')
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async batchMarkAttendance(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const { changes, date, period, day } = req.body;
      const user = req.user as IUser | undefined;

      if (!user?.id || !mongoose.Types.ObjectId.isValid(user.id)) {
        throw new Error('Unauthorized: Valid teacher ID required');
      }
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid class ID format');
      }
      if (!Number.isInteger(period) || period < 1 || period > 6) {
        throw new Error('Invalid period: Must be an integer between 1 and 6');
      }
      if (
        !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)
      ) {
        throw new Error(
          'Invalid day: Must be Monday, Tuesday, Wednesday, Thursday, or Friday'
        );
      }
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }

      for (const { studentId, status } of changes) {
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
          throw new Error(`Invalid student ID format: ${studentId}`);
        }
        if (!['present', 'absent'].includes(status)) {
          throw new Error(
            `Invalid status for student ${studentId}: Must be "present" or "absent"`
          );
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
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Batch attendance marked successfully',
      } as IApiResponse<never>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status =
        message.includes('Unauthorized') || message.includes('Invalid')
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

      const attendanceRecords =
        await this.viewAttendanceUseCase.execute(studentId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Attendance records fetched successfully',
        data: attendanceRecords,
      } as IApiResponse<Attendance[]>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status =
        message.includes('Unauthorized') || message.includes('Invalid')
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async GetRecentSessionAttendance(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser | undefined;

      if (!user?.id || !mongoose.Types.ObjectId.isValid(user.id)) {
        throw new Error('Unauthorized: Valid teacher ID required');
      }
      if (!mongoose.Types.ObjectId.isValid(user.id)) {
        throw new Error('Invalid student ID format');
      }

      const sessionAttendance =
        await this.getRecentSessionAttendanceUseCase.execute(user.id);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Attendance records fetched successfully',
        data: sessionAttendance,
      } as IApiResponse<SessionAttendanceDTO[]>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status =
        message.includes('Unauthorized') || message.includes('Invalid')
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
}
