import { ObjectId } from '../../../../types';
import { Timetable } from '../../../../domain/entities/timetable';
import { ITimetableRepository } from '../../../../domain/interface/admin/ITimetableRepository';
import { IManageTimetableUseCase } from '../../../../domain/interface/IManageTimetableUseCase';
import { IUpdateTeacherAvailabilityUseCase } from '../../../../domain/interface/IUpdateTeacherAvailabilityUseCase';
import { Day } from '../../../../domain/types/enums';
import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository';

export class ManageTimetableUseCase implements IManageTimetableUseCase {
  constructor(
    private timetableRepo: ITimetableRepository,
    private teacherRepo: ITeacherRepository,
    private updateTeacherAvailability: IUpdateTeacherAvailabilityUseCase
  ) {}

  async assignTeacher(
    classId: ObjectId,
    day: Day,
    period: number,
    teacherId: ObjectId,
    subject: string
  ): Promise<Timetable> {
    try {
      const timetable = await this.timetableRepo.getByClassId(classId);
      const teacher = await this.teacherRepo.getById(teacherId);

      if (!teacher.availability[day].includes(period)) {
        throw new Error('Teacher unavailable for this period');
      }

      const conflict = await this.timetableRepo.findConflict(teacherId, day, period);
      if (conflict) {
        throw new Error('Teacher already assigned to another class for this slot');
      }

      timetable.assignTeacher(day, period, teacherId, subject);
      await this.updateTeacherAvailability.updateAvailability(teacherId, day, period, false);
      await this.timetableRepo.save(timetable);
      return timetable;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to assign teacher');
    }
  }

  async updateTimetableSlot(
    classId: ObjectId,
    day: Day,
    period: number,
    teacherId: ObjectId,
    subject: string
  ): Promise<Timetable> {
    try {
      const timetable = await this.timetableRepo.getByClassId(classId);
      const newTeacher = await this.teacherRepo.getById(teacherId);

      if (!newTeacher.availability[day].includes(period)) {
        throw new Error('Teacher unavailable for this period');
      }

      const conflict = await this.timetableRepo.findConflict(teacherId, day, period);
      if (conflict && conflict.classId.toString() !== classId.toString()) {
        throw new Error('Teacher already assigned to another class for this slot');
      }

      const currentSlot = timetable.schedule[day]?.find((s) => s.period === period);
      if (currentSlot?.teacherId && !currentSlot.teacherId.equals(teacherId)) {
        await this.updateTeacherAvailability.updateAvailability(
          currentSlot.teacherId,
          day,
          period,
          true
        );
      }

      timetable.assignTeacher(day, period, teacherId, subject);
      await this.updateTeacherAvailability.updateAvailability(teacherId, day, period, false);
      await this.timetableRepo.save(timetable);
      return timetable;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update timetable slot');
    }
  }

  async deleteTimetableSlot(classId: ObjectId, day: Day, period: number): Promise<Timetable> {
    try {
      const timetable = await this.timetableRepo.getByClassId(classId);
      const slot = timetable.schedule[day]?.find((s) => s.period === period);
      if (!slot || !slot.teacherId) {
        throw new Error('No teacher assigned to this slot');
      }

      await this.updateTeacherAvailability.updateAvailability(slot.teacherId, day, period, true);
      timetable.clearSlot(day, period);
      await this.timetableRepo.save(timetable);
      return timetable;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete timetable slot');
    }
  }

  async getTimetable(classId: ObjectId): Promise<Timetable> {
    try {
      const timetable = await this.timetableRepo.getByClassId(classId);
      return timetable;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch timetable');
    }
  }
}