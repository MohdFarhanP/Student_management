import { ObjectId } from '../../types/index.js';
import Timetable from '../entities/timetable.js';

export interface ITimetableRepository {
  getByClassId(classId: ObjectId): Promise<Timetable>;
  save(timetable: Timetable): Promise<void>;
  findConflict(
    teacherId: ObjectId,
    day: string,
    period: number
  ): Promise<Timetable | null>;
}
