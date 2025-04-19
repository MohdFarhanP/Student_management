import { Types } from 'mongoose';
import Timetable from '../../domain/entities/timetable';
import { ITimetableRepository } from '../../domain/interface/admin/ITimetableRepository';
import { TeacherRepository } from '../repositories/admin/teacherRepository';

export class ManageTimetable {
  private timetableRepo: ITimetableRepository;
  private teacherRepo: TeacherRepository;

  constructor(
    timetableRepo: ITimetableRepository,
    teacherRepo: TeacherRepository
  ) {
    this.timetableRepo = timetableRepo;
    this.teacherRepo = teacherRepo;
  }

  async getTimetable(classId: Types.ObjectId): Promise<Timetable> {
    return this.timetableRepo.getByClassId(classId);
  }

  async validateTeacherAssignment(
    classId: Types.ObjectId,
    day: string,
    period: number,
    teacherId: Types.ObjectId
  ): Promise<boolean> {
    const timetable = await this.getTimetable(classId);
    const slot = timetable.schedule[day]?.find((s) => s.period === period);
    return slot?.teacherId?.toString() === teacherId.toString();
  }

  async assignTeacher(
    classId: Types.ObjectId,
    day: string,
    period: number,
    teacherId: Types.ObjectId,
    subject: string
  ): Promise<Timetable> {
    const timetable = await this.timetableRepo.getByClassId(classId);
    const teacher = await this.teacherRepo.getById(teacherId);

    if (!teacher.availability[day].includes(period)) {
      throw new Error('Teacher unavailable');
    }

    const conflict = await this.timetableRepo.findConflict(
      teacherId,
      day,
      period
    );
    if (conflict) {
      throw new Error('Teacher already assigned');
    }

    timetable.assignTeacher(day, period, teacherId, subject);
    await this.timetableRepo.save(timetable);
    return timetable;
  }

  async updateTimetableSlot(
    classId: Types.ObjectId,
    day: string,
    period: number,
    teacherId: Types.ObjectId,
    subject: string
  ): Promise<Timetable> {
    const timetable = await this.timetableRepo.getByClassId(classId);
    const teacher = await this.teacherRepo.getById(teacherId);

    if (!teacher.availability[day].includes(period)) {
      throw new Error('Teacher unavailable');
    }

    const conflict = await this.timetableRepo.findConflict(
      teacherId,
      day,
      period
    );
    if (conflict && conflict.classId.toString() !== classId.toString()) {
      throw new Error('Teacher already assigned to another class');
    }

    timetable.assignTeacher(day, period, teacherId, subject);
    await this.timetableRepo.save(timetable);
    return timetable;
  }

  async deleteTimetableSlot(
    classId: Types.ObjectId,
    day: string,
    period: number
  ): Promise<Timetable> {
    const timetable = await this.timetableRepo.getByClassId(classId);
    const slot = timetable.schedule[day]?.find((s) => s.period === period);
    if (!slot || !slot.teacherId) {
      throw new Error('No teacher assigned to this slot');
    }

    const teacherId = slot.teacherId;
    const teacher = await this.teacherRepo.getById(teacherId);
    if (!teacher.availability[day].includes(period)) {
      teacher.availability[day].push(period);
      teacher.availability[day].sort((a, b) => a - b);
      await this.teacherRepo.save(teacher);
    }

    timetable.assignTeacher(day, period, null, null);
    await this.timetableRepo.save(timetable);
    return timetable;
  }
}

export default ManageTimetable;
