import { Types } from 'mongoose';
import { Timetable } from '../../domain/entities/timetable';
import { ITimetableRepository } from '../../domain/repositories/ITimetableRepository';
import { ITeacherRepository } from '../../domain/repositories/ITeacherRepository';
import { ITimetableService } from '../../application/services/ITimetableService';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../domain/errors';
import { Day } from '../../domain/types/enums';

export class TimetableService implements ITimetableService {
  constructor(
    private timetableRepo: ITimetableRepository,
    private teacherRepo: ITeacherRepository
  ) {}

  async getTimetable(classId: Types.ObjectId): Promise<Timetable> {
    if (!Types.ObjectId.isValid(classId)) {
      throw new BadRequestError('Invalid class ID');
    }
    const timetable = await this.timetableRepo.getByClassId(classId);
    if (!timetable) {
      throw new NotFoundError('Timetable not found');
    }
    return timetable;
  }

  async validateTeacherAssignment(
    classId: Types.ObjectId,
    day: Day,
    period: number,
    teacherId: Types.ObjectId
  ): Promise<boolean> {
    if (
      !Types.ObjectId.isValid(classId) ||
      !Types.ObjectId.isValid(teacherId)
    ) {
      throw new BadRequestError('Invalid class or teacher ID');
    }
    if (!Object.values(Day).includes(day)) {
      throw new BadRequestError('Invalid day');
    }
    if (!Number.isInteger(period) || period < 1 || period > 6) {
      throw new BadRequestError('Invalid period: Must be between 1 and 6');
    }

    const timetable = await this.getTimetable(classId);
    const slot = timetable.schedule[day]?.find((s) => s.period === period);
    if (!slot || !slot.teacherId) {
      return false;
    }
    return slot.teacherId.equals(teacherId);
  }

  async assignTeacher(
    classId: Types.ObjectId,
    day: Day,
    period: number,
    teacherId: Types.ObjectId,
    subject: string
  ): Promise<Timetable> {
    if (
      !Types.ObjectId.isValid(classId) ||
      !Types.ObjectId.isValid(teacherId)
    ) {
      throw new BadRequestError('Invalid class or teacher ID');
    }
    if (!Object.values(Day).includes(day)) {
      throw new BadRequestError('Invalid day');
    }
    if (!Number.isInteger(period) || period < 1 || period > 6) {
      throw new BadRequestError('Invalid period: Must be between 1 and 6');
    }
    if (!subject) {
      throw new BadRequestError('Subject is required');
    }

    const timetable = await this.getTimetable(classId);
    const teacher = await this.teacherRepo.getById(teacherId);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    if (!teacher.availability[day]?.includes(period)) {
      throw new ConflictError('Teacher unavailable for this period');
    }

    const conflict = await this.timetableRepo.findConflict(
      teacherId,
      day,
      period
    );
    if (conflict) {
      throw new ConflictError('Teacher already assigned to another class');
    }

    timetable.assignTeacher(day, period, teacherId, subject);
    await this.timetableRepo.save(timetable);
    return timetable;
  }

  async updateTimetableSlot(
    classId: Types.ObjectId,
    day: Day,
    period: number,
    teacherId: Types.ObjectId,
    subject: string
  ): Promise<Timetable> {
    return this.assignTeacher(classId, day, period, teacherId, subject);
  }

  async deleteTimetableSlot(
    classId: Types.ObjectId,
    day: Day,
    period: number
  ): Promise<Timetable> {
    if (!Types.ObjectId.isValid(classId)) {
      throw new BadRequestError('Invalid class ID');
    }
    if (!Object.values(Day).includes(day)) {
      throw new BadRequestError('Invalid day');
    }
    if (!Number.isInteger(period) || period < 1 || period > 6) {
      throw new BadRequestError('Invalid period: Must be between 1 and 6');
    }

    const timetable = await this.getTimetable(classId);
    const slot = timetable.schedule[day]?.find((s) => s.period === period);
    if (!slot || !slot.teacherId) {
      throw new NotFoundError('No teacher assigned to this slot');
    }

    const teacherId = slot.teacherId;
    const teacher = await this.teacherRepo.getById(teacherId);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    if (!teacher.availability[day]?.includes(period)) {
      teacher.availability[day] = teacher.availability[day] || [];
      teacher.availability[day].push(period);
      teacher.availability[day].sort((a, b) => a - b);
      await this.teacherRepo.save(teacher);
    }

    timetable.assignTeacher(day, period, null, null);
    await this.timetableRepo.save(timetable);
    return timetable;
  }
}
