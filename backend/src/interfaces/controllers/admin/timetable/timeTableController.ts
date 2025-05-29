import { Request, Response } from 'express';
import { IManageTimetableUseCase } from '../../../../domain/useCase/IManageTimetableUseCase';
import { ITimetableController } from './ITimetableController';
import {
  IApiResponse,
  TimetableSlot,
} from '../../../../domain/types/interfaces';
import { HttpStatus } from '../../../../domain/types/enums';
import mongoose from 'mongoose';
import { Day } from '../../../../domain/types/enums';
import { Timetable } from '../../../../domain/entities/timetable';

export class TimetableController implements ITimetableController {
  constructor(private manageTimetable: IManageTimetableUseCase) {}

  async assignTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const { day, period, teacherId, subject } = req.body;

      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid classId format');
      }
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        throw new Error('Invalid teacherId format');
      }
      if (!Object.values(Day).includes(day)) {
        throw new Error(
          'Invalid day. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday'
        );
      }
      if (!Number.isInteger(period) || period < 1 || period > 6) {
        throw new Error('Invalid period. Must be an integer between 1 and 6');
      }
      if (!subject || typeof subject !== 'string') {
        throw new Error('Subject must be a non-empty string');
      }

      const classIdObj = new mongoose.Types.ObjectId(classId);
      const teacherIdObj = new mongoose.Types.ObjectId(teacherId);
      const updatedTimetable = await this.manageTimetable.assignTeacher(
        classIdObj,
        day,
        period,
        teacherIdObj,
        subject
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Teacher assigned successfully',
        data: updatedTimetable,
      } as IApiResponse<Timetable>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async updateTimetableSlot(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const { day, period, teacherId, subject } = req.body;

      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid classId format');
      }
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        throw new Error('Invalid teacherId format');
      }
      if (!Object.values(Day).includes(day)) {
        throw new Error(
          'Invalid day. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday'
        );
      }
      if (!Number.isInteger(period) || period < 1 || period > 6) {
        throw new Error('Invalid period. Must be an integer between 1 and 6');
      }
      if (!subject || typeof subject !== 'string') {
        throw new Error('Subject must be a non-empty string');
      }

      const classIdObj = new mongoose.Types.ObjectId(classId);
      const teacherIdObj = new mongoose.Types.ObjectId(teacherId);
      const updatedTimetable = await this.manageTimetable.updateTimetableSlot(
        classIdObj,
        day,
        period,
        teacherIdObj,
        subject
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Timetable slot updated successfully',
        data: updatedTimetable,
      } as IApiResponse<Timetable>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async deleteTimetableSlot(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const { day, period } = req.body;

      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid classId format');
      }
      if (!Object.values(Day).includes(day)) {
        throw new Error(
          'Invalid day. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday'
        );
      }
      if (!Number.isInteger(period) || period < 1 || period > 6) {
        throw new Error('Invalid period. Must be an integer between 1 and 6');
      }

      const classIdObj = new mongoose.Types.ObjectId(classId);
      const updatedTimetable = await this.manageTimetable.deleteTimetableSlot(
        classIdObj,
        day,
        period
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Timetable slot deleted successfully',
        data: updatedTimetable,
      } as IApiResponse<Timetable>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async getTimetable(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid classId format');
      }

      const classIdObj = new mongoose.Types.ObjectId(classId);
      const timetable = await this.manageTimetable.getTimetable(classIdObj);
      res.status(HttpStatus.OK).json({
        success: true,
        message: timetable.schedule
          ? 'Timetable fetched successfully'
          : 'No timetable found',
        data: timetable.toJSON(),
      } as IApiResponse<Timetable>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
  async getTimetableForToday(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid classId format');
      }

      const classIdObj = new mongoose.Types.ObjectId(classId);
      const timetable =
        await this.manageTimetable.getTimetableForToday(classIdObj);
      res.status(HttpStatus.OK).json({
        success: true,
        message: timetable
          ? 'Timetable fetched successfully'
          : 'No timetable found',
        data: timetable,
      } as IApiResponse<TimetableSlot[]>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
}
