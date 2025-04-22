import { ObjectId } from '../../../../types/index';
import Timetable from '../../../../domain/entities/timetable';
import { ITimetableRepository } from '../../../../domain/interface/admin/ITimetableRepository';
import { TeacherRepository } from '../../../../infrastructure/repositories/admin/teacherRepository';
import { TeacherData } from '../../../../types/index';
import { Teacher } from '../../../../domain/entities/teacher';

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

    // Check if teacher is available
    if (!teacher.availability[day].includes(period)) {
      throw new Error('Teacher unavailable for this period');
    }

    // Check for conflicts
    const conflict = await this.timetableRepo.findConflict(teacherId, day, period);
    if (conflict) {
      throw new Error('Teacher already assigned to another class for this slot');
    }

    // Assign teacher to timetable
    timetable.assignTeacher(day, period, teacherId, subject);

    // Update teacher's availability (remove the period)
    teacher.availability[day] = teacher.availability[day].filter((p) => p !== period);
    await this.teacherRepo.save(teacher);

    // Save timetable
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
    const newTeacher = await this.teacherRepo.getById(teacherId);

    // Check if new teacher is available
    if (!newTeacher.availability[day].includes(period)) {
      throw new Error('Teacher unavailable for this period');
    }

    // Check for conflicts
    const conflict = await this.timetableRepo.findConflict(teacherId, day, period);
    if (conflict && conflict.classId.toString() !== classId.toString()) {
      throw new Error('Teacher already assigned to another class for this slot');
    }

    // Get the current slot (if any) to identify the previous teacher
    const currentSlot = timetable.schedule[day]?.find((s) => s.period === period);
    let previousTeacher: Teacher | null = null;
    if (currentSlot?.teacherId && !currentSlot.teacherId.equals(teacherId)) {
      // If the teacher is changing, restore availability for the previous teacher
      previousTeacher = await this.teacherRepo.getById(currentSlot.teacherId);
      if (!previousTeacher.availability[day].includes(period)) {
        previousTeacher.availability[day].push(period);
        previousTeacher.availability[day].sort((a, b) => a - b);
        await this.teacherRepo.save(previousTeacher);
      }
    }

    // Update timetable slot
    timetable.assignTeacher(day, period, teacherId, subject);

    // Update new teacher's availability (remove the period)
    newTeacher.availability[day] = newTeacher.availability[day].filter((p) => p !== period);
    await this.teacherRepo.save(newTeacher);

    // Save timetable
    await this.timetableRepo.save(timetable);
    return timetable;
  }

  async deleteTimetableSlot(
    classId: ObjectId,
    day: string,
    period: number
  ): Promise<Timetable> {
    const timetable = await this.timetableRepo.getByClassId(classId);

    // Get the current slot
    const slot = timetable.schedule[day]?.find((s) => s.period === period);
    if (!slot || !slot.teacherId) {
      throw new Error('No teacher assigned to this slot');
    }

    // Restore availability for the teacher
    const teacher = await this.teacherRepo.getById(slot.teacherId);
    if (!teacher.availability[day].includes(period)) {
      teacher.availability[day].push(period);
      teacher.availability[day].sort((a, b) => a - b);
      await this.teacherRepo.save(teacher);
    }

    // Clear the timetable slot
    timetable.assignTeacher(day, period, null, null);

    // Save timetable
    await this.timetableRepo.save(timetable);
    return timetable;
  }

  async getTimetable(classId: ObjectId): Promise<Timetable> {
    return this.timetableRepo.getByClassId(classId);
  }
}

export default ManageTimetable;