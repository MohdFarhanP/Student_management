import { TeacherRepository } from '../../../../infrastructure/repositories/admin/teacherRepository.js';
import { SubjectModel } from '../../../../infrastructure/database/models/subjectModel.js';
import { ClassModel } from '../../../../infrastructure/database/models/classModel.js';
import { ITeacher } from '../../../../domain/interface/ITeacher.js';
import { Teacher } from '../../../../domain/entities/teacher.js';

export class AddTeacherUseCase {
  constructor(private teacherRepository: TeacherRepository) {}

  async execute(teacherData: Partial<ITeacher>): Promise<Teacher> {
    try {
      if (teacherData.subject && typeof teacherData.subject === 'string') {
        const subjectDoc = await SubjectModel.findOne({
          subjectName: teacherData.subject,
        });
        if (!subjectDoc) {
          throw new Error(`Subject '${teacherData.subject}' not found`);
        }
        teacherData.subject = subjectDoc._id;
      }

      if (
        teacherData.assignedClass &&
        typeof teacherData.assignedClass === 'string'
      ) {
        const classDoc = await ClassModel.findOne({
          name: teacherData.assignedClass,
        });
        if (!classDoc) {
          throw new Error(`Class '${teacherData.assignedClass}' not found`);
        }
        teacherData.assignedClass = classDoc._id;
      }

      const newTeacher = await this.teacherRepository.create(teacherData);
      return newTeacher;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error adding teacher');
    }
  }
}
