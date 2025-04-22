import mongoose from 'mongoose';
import { ObjectId } from '../../../types';
import { ITimetableRepository } from '../../../domain/interface/admin/ITimetableRepository';
import { Timetable } from '../../../domain/entities/timetable';
import TimetableModel from '../../database/models/timeTableModel';
import { Day } from '../../../domain/types/enums';

export class TimetableRepository implements ITimetableRepository {
  async getByClassId(classId: ObjectId): Promise<Timetable> {
    try {
      const data = await TimetableModel.findOne({ classId }).lean();
      if (!data) {
        return new Timetable(classId, {
          [Day.Monday]: [],
          [Day.Tuesday]: [],
          [Day.Wednesday]: [],
          [Day.Thursday]: [],
          [Day.Friday]: [],
        });
      }
      const classIdObj = new mongoose.Types.ObjectId(data.classId.toString());
      return new Timetable(classIdObj, data.schedule);
    } catch (error) {
      throw new Error(
        `Failed to fetch timetable for classId ${classId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async save(timetable: Timetable): Promise<void> {
    try {
      await TimetableModel.updateOne(
        { classId: timetable.classId },
        { schedule: timetable.schedule },
        { upsert: true }
      );
    } catch (error) {
      throw new Error(
        `Failed to save timetable for classId ${timetable.classId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findConflict(teacherId: ObjectId, day: Day, period: number): Promise<Timetable | null> {
    try {
      const conflict = await TimetableModel.findOne({
        [`schedule.${day}`]: { $elemMatch: { period, teacherId } },
      }).lean();
      if (!conflict) return null;
      const classIdObj = new mongoose.Types.ObjectId(conflict.classId.toString());
      return new Timetable(classIdObj, conflict.schedule);
    } catch (error) {
      throw new Error(
        `Failed to check conflict for teacherId ${teacherId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}