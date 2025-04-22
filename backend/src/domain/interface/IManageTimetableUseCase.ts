import { ObjectId } from '../../types';
import { Timetable } from '../entities/timetable';
import { Day } from '../types/enums';

export interface IManageTimetableUseCase {
  assignTeacher(
    classId: ObjectId,
    day: Day,
    period: number,
    teacherId: ObjectId,
    subject: string
  ): Promise<Timetable>;
  updateTimetableSlot(
    classId: ObjectId,
    day: Day,
    period: number,
    teacherId: ObjectId,
    subject: string
  ): Promise<Timetable>;
  deleteTimetableSlot(classId: ObjectId, day: Day, period: number): Promise<Timetable>;
  getTimetable(classId: ObjectId): Promise<Timetable>;
}