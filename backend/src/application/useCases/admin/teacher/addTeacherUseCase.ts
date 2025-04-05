import { TeacherRepository } from '../../../../infrastructure/repositories/admin/teacherRepository.js';
import { SubjectModel } from '../../../../infrastructure/database/models/subjectModel.js';
import { ClassModel } from '../../../../infrastructure/database/models/classModel.js';
import { ITeacher } from '../../../../domain/interface/ITeacher.js';
import { Teacher } from '../../../../domain/entities/teacher.js';

export class AddTeacherUseCase {
  constructor(private teacherRepository: TeacherRepository) {}

  async execute(teacherData: Partial<ITeacher>): Promise<Teacher> {
    try {
      const newTeacher = await this.teacherRepository.create(teacherData);
      return newTeacher;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error adding teacher');
    }
  }
}
