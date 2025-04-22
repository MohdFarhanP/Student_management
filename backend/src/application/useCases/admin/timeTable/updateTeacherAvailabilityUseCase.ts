import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository';
import { IUpdateTeacherAvailabilityUseCase } from '../../../../domain/interface/IUpdateTeacherAvailabilityUseCase';
import { ObjectId } from '../../../../types';
import { Day } from '../../../../domain/types/enums';
import { Teacher } from '../../../../domain/entities/teacher';

export class UpdateTeacherAvailabilityUseCase implements IUpdateTeacherAvailabilityUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async updateAvailability(
    teacherId: ObjectId,
    day: Day,
    period: number,
    isAdding: boolean
  ): Promise<Teacher> {
    try {
      const teacher = await this.teacherRepository.getById(teacherId);
      if (!teacher) {
        throw new Error('Teacher not found');
      }

      if (isAdding) {
        if (!teacher.availability[day].includes(period)) {
          teacher.availability[day].push(period);
          teacher.availability[day].sort((a, b) => a - b);
        }
      } else {
        teacher.availability[day] = teacher.availability[day].filter((p) => p !== period);
      }

      const updatedTeacher = await this.teacherRepository.update(teacherId.toString(), {
        availability: teacher.availability,
      });
      return updatedTeacher;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update teacher availability');
    }
  }
}