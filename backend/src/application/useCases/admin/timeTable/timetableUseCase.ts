import { ObjectId } from '../../../../types/index.js';
import Timetable from '../../../../domain/entities/timetable.js';
import { ITimetableRepository } from '../../../../domain/interface/admin/ITimetableRepository.js';
import { TeacherRepository } from '../../../../infrastructure/repositories/admin/teacherRepository.js';

class ManageTimetable {
  private timetableRepo: ITimetableRepository;
  private teacherRepo: TeacherRepository;

  constructor(
    timetableRepo: ITimetableRepository,
    teacherRepo: TeacherRepository
  ) {
    this.timetableRepo = timetableRepo;
    this.teacherRepo = teacherRepo;
  }

  async assignTeacher(
    classId: ObjectId,
    day: string,
    period: number,
    teacherId: ObjectId,
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
    classId: ObjectId,
    day: string,
    period: number,
    teacherId: ObjectId,
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
    classId: ObjectId,
    day: string,
    period: number
  ): Promise<Timetable> {
    const timetable = await this.timetableRepo.getByClassId(classId);

    const slot = timetable.schedule[day]?.find((s) => s.period === period);
    if (!slot || !slot.teacherId) {
      throw new Error('No teacher assigned to this slot');
    }

    const teacher = await this.teacherRepo.getById(slot.teacherId);
    if (!teacher.availability[day].includes(period)) {
      teacher.availability[day].push(period);
      teacher.availability[day].sort((a, b) => a - b);
      await this.teacherRepo.save(teacher);
    }

    timetable.assignTeacher(day, period, null, null);
    await this.timetableRepo.save(timetable);
    return timetable;
  }
  async getTimetable(classId: ObjectId): Promise<Timetable> {
    return this.timetableRepo.getByClassId(classId);
  }
}

export default ManageTimetable;
