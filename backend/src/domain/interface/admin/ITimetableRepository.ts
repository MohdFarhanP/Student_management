import { Types } from 'mongoose';
import { Timetable } from '../../entities/timetable';
import { TimetableSchedule, TimetableSlot } from '../../types/interfaces';
import { ObjectId } from '../../../types';
export interface ITimetableRepository {
  getByClassId(classId: Types.ObjectId): Promise<Timetable>;
  save(timetable: Timetable): Promise<void>;
  findConflict(
    teacherId: Types.ObjectId,
    day: string,
    period: number
  ): Promise<Timetable | null>;
  TodayTimeTable(classId: ObjectId): Promise<TimetableSlot[] | []>
}
