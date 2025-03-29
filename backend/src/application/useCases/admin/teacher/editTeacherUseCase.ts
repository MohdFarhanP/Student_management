import { TeacherRepository } from '../../../../infrastructure/repositories/teacherRepository.js';
import { ITeacher } from '../../../../domain/interface/ITeacher.js';
import { Teacher } from '../../../../domain/entities/teacher.js';
import { Types } from 'mongoose';
import { SubjectModel } from '../../../../infrastructure/database/models/subjectModel.js';
import { ClassModel } from '../../../../infrastructure/database/models/classModel.js';

export class EditTeacherUseCase {
  constructor(private teacherRepository: TeacherRepository) {}

  async execute(
    teacherId: string,
    teacherData: Partial<ITeacher>
  ): Promise<Teacher> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) {
        throw new Error('Invalid teacher ID');
      }

      const existingTeacher = await this.teacherRepository.getById(teacherId);
      if (!existingTeacher) {
        throw new Error('Teacher not found');
      }

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

      const updatedTeacher = await this.teacherRepository.update(
        teacherId,
        teacherData
      );
      return updatedTeacher;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error updating teacher');
    }
  }
}
