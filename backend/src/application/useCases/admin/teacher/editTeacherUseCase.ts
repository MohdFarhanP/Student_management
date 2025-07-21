import { ITeacherRepository } from '../../../../domain/repositories/ITeacherRepository';
import { ITeacher } from '../../../../domain/types/interfaces';
import { TeacherEntity } from '../../../../domain/entities/teacher';
import { IEditTeacherUseCase } from '../../../../domain/useCase/IEditTeacherUseCase';
import { IClassRepository } from '../../../../domain/repositories/IClassRepository';
import { ISubjectRepository } from '../../../../domain/repositories/ISubjectRepository';
import { Types } from 'mongoose';
import { Gender, Day } from '../../../../domain/types/enums';
import logger from '../../../../logger';

export class EditTeacherUseCase implements IEditTeacherUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private classRepository: IClassRepository,
    private subjectRepository: ISubjectRepository
  ) {}

  async execute(
    teacherId: string,
    teacherData: Partial<ITeacher>
  ): Promise<TeacherEntity> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) {
        throw new Error('Invalid teacher ID');
      }
      const existingTeacher = await this.teacherRepository.getById(teacherId);
      if (!existingTeacher) {
        throw new Error('Teacher not found');
      }
      if (teacherData.subject && typeof teacherData.subject === 'string') {
        const subjectDoc = await this.subjectRepository.findByName(
          teacherData.subject
        );
        if (!subjectDoc) {
          throw new Error(`Subject '${teacherData.subject}' not found`);
        }
        teacherData.subject = subjectDoc.id;
      }
      if (
        teacherData.assignedClass &&
        typeof teacherData.assignedClass === 'string'
      ) {
        logger.debug(
          'assinged class in teacher data',
          teacherData.assignedClass
        );
        const classDoc = await this.classRepository.findByName(
          teacherData.assignedClass
        );
        logger.debug('editClassUseCase getting class doc from repo :', classDoc);
        if (!classDoc) {
          throw new Error(`Class '${teacherData.assignedClass}' not found`);
        }
        teacherData.assignedClass = classDoc.id;
      }
      if (teacherData.gender && typeof teacherData.gender === 'string') {
        if (
          teacherData.gender !== Gender.Male &&
          teacherData.gender !== Gender.Female
        ) {
          throw new Error(`Invalid gender value: '${teacherData.gender}'`);
        }
        teacherData.gender = teacherData.gender as Gender;
      }
      if (teacherData.availability) {
        const validDays = [
          Day.Monday,
          Day.Tuesday,
          Day.Wednesday,
          Day.Thursday,
          Day.Friday,
        ];
        const availability: ITeacher['availability'] = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
        };
        for (const day of validDays) {
          availability[day] = Array.isArray(teacherData.availability[day])
            ? teacherData.availability[day]
            : [];
        }
        teacherData.availability = availability;
      }
      const updatedTeacher = await this.teacherRepository.update(
        teacherId,
        teacherData
      );
      return updatedTeacher;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to update teacher');
    }
  }
}
