import { Types } from 'mongoose';
import { Timetable } from '../../domain/entities/timetable';

export interface ITimetableService {
  getTimetable(classId: Types.ObjectId): Promise<Timetable>;
  validateTeacherAssignment(
    classId: Types.ObjectId,
    day: string,
    period: number,
    teacherId: Types.ObjectId
  ): Promise<boolean>;
  assignTeacher(
    classId: Types.ObjectId,
    day: string,
    period: number,
    teacherId: Types.ObjectId,
    subject: string
  ): Promise<Timetable>;
  updateTimetableSlot(
    classId: Types.ObjectId,
    day: string,
    period: number,
    teacherId: Types.ObjectId,
    subject: string
  ): Promise<Timetable>;
  deleteTimetableSlot(
    classId: Types.ObjectId,
    day: string,
    period: number
  ): Promise<Timetable>;
}
