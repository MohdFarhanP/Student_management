import { ObjectId } from '../types/common';
import { Timetable } from '../entities/timetable';
import { Day } from '../types/enums';
import { TimetableSlot } from '../types/interfaces';

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
  deleteTimetableSlot(
    classId: ObjectId,
    day: Day,
    period: number
  ): Promise<Timetable>;
  getTimetable(classId: ObjectId): Promise<Timetable>;
  getTimetableForToday(classId: ObjectId): Promise<TimetableSlot[] | []>;
}
