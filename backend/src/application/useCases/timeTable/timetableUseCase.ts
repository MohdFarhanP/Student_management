import { ObjectId } from '../../../types/index.js';
import Timetable from '../../../domain/entities/timetable.js';
import { ITimetableRepository } from '../../../domain/interface/ITimetableRepository.js';
import { TeacherRepository } from '../../../infrastructure/repositories/teacherRepository.js';

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

  async getTimetable(classId: ObjectId): Promise<Timetable> {
    return this.timetableRepo.getByClassId(classId);
  }
}

export default ManageTimetable;
