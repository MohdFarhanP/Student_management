import { Request, Response } from 'express';
import ManageTimetable from '../../application/useCases/timeTable/timetableUseCase.js';
import mongoose from 'mongoose';
import HttpStatus from '../../utils/httpStatus.js';
import { ObjectId } from '../../types/index.js';

class TimetableController {
  private manageTimetable: ManageTimetable;

  constructor(manageTimetable: ManageTimetable) {
    this.manageTimetable = manageTimetable;
  }

  async assignTeacher(req: Request, res: Response): Promise<void> {
    const { classId } = req.params;
    const { day, period, teacherId, subject } = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid classId format');
      }

      if (
        !day ||
        !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)
      ) {
        throw new Error(
          'Invalid day. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday'
        );
      }
      if (!period || !Number.isInteger(period) || period < 1 || period > 6) {
        throw new Error('Invalid period. Must be an integer between 1 and 6');
      }
      if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
        throw new Error('Invalid teacherId format');
      }
      if (!subject || typeof subject !== 'string') {
        throw new Error('Subject must be a non-empty string');
      }

      const classIdObj = new mongoose.Types.ObjectId(classId as string);
      const teacherIdObj = new mongoose.Types.ObjectId(teacherId as string);
      const updatedTimetable = await this.manageTimetable.assignTeacher(
        classIdObj,
        day,
        period,
        teacherIdObj,
        subject
      );
      res.status(HttpStatus.OK).json(updatedTimetable);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  async updateTimetableSlot(req: Request, res: Response): Promise<void> {
    const { classId } = req.params;
    const { day, period, teacherId, subject } = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid classId format');
      }

      if (
        !day ||
        !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)
      ) {
        throw new Error(
          'Invalid day. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday'
        );
      }
      if (!period || !Number.isInteger(period) || period < 1 || period > 6) {
        throw new Error('Invalid period. Must be an integer between 1 and 6');
      }
      if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
        throw new Error('Invalid teacherId format');
      }
      if (!subject || typeof subject !== 'string') {
        throw new Error('Subject must be a non-empty string');
      }

      const classIdObj = new mongoose.Types.ObjectId(classId as string);
      const teacherIdObj = new mongoose.Types.ObjectId(teacherId as string);
      const updatedTimetable = await this.manageTimetable.updateTimetableSlot(
        classIdObj,
        day,
        period,
        teacherIdObj,
        subject
      );
      res.status(HttpStatus.OK).json(updatedTimetable);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  async deleteTimetableSlot(req: Request, res: Response): Promise<void> {
    const { classId } = req.params;
    const { day, period } = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid classId format');
      }

      if (
        !day ||
        !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)
      ) {
        throw new Error(
          'Invalid day. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday'
        );
      }
      if (!period || !Number.isInteger(period) || period < 1 || period > 6) {
        throw new Error('Invalid period. Must be an integer between 1 and 6');
      }

      const classIdObj = new mongoose.Types.ObjectId(classId as string);
      const updatedTimetable = await this.manageTimetable.deleteTimetableSlot(
        classIdObj,
        day,
        period
      );
      res.status(HttpStatus.OK).json(updatedTimetable);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  async getTimetable(req: Request, res: Response): Promise<void> {
    const { classId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid classId format');
      }

      const classIdObj = new mongoose.Types.ObjectId(classId);
      const timetable = await this.manageTimetable.getTimetable(classIdObj);
      res.status(HttpStatus.OK).json(timetable);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
}

export default TimetableController;
