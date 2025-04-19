import Timetable from '../../../domain/entities/timetable';
import TimetableModel from '../../database/models/timeTableModel';
import { ITimetableRepository } from '../../../domain/interface/admin/ITimetableRepository';
import { ObjectId } from '../../../types/index';

class TimetableRepository implements ITimetableRepository {
  async getByClassId(classId: ObjectId): Promise<Timetable> {
    try {
      const data = await TimetableModel.findOne({ classId });
      return data
        ? new Timetable(data.classId, data.schedule)
        : new Timetable(classId);
    } catch (error) {
      throw new Error(
        `Failed to fetch timetable for classId ${classId}: ${(error as Error).message}`
      );
    }
  }

  async save(timetable: Timetable): Promise<void> {
    try {
      await TimetableModel.findOneAndUpdate(
        { classId: timetable.classId },
        { schedule: timetable.schedule },
        { upsert: true }
      );
    } catch (error) {
      throw new Error(
        `Failed to save timetable for classId ${timetable.classId}: ${(error as Error).message}`
      );
    }
  }

  async findConflict(
    teacherId: ObjectId,
    day: string,
    period: number
  ): Promise<Timetable | null> {
    try {
      const conflict = await TimetableModel.findOne({
        [`schedule.${day}`]: { $elemMatch: { period, teacherId } },
      });
      return conflict
        ? new Timetable(conflict.classId, conflict.schedule)
        : null;
    } catch (error) {
      throw new Error(
        `Failed to check conflict for teacherId ${teacherId}: ${(error as Error).message}`
      );
    }
  }
}

export default TimetableRepository;
