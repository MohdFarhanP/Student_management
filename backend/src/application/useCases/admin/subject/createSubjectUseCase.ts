import { ISubjectRepository } from '../../../../domain/interface/ISubjectRepository';
import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { SubjectEntity } from '../../../../domain/entities/subject';
import { Types } from 'mongoose';
import { ICreateSubjectUseCase } from '../../../../domain/interface/ICreateSubjectUseCase';

export class CreateSubjectUseCase implements ICreateSubjectUseCase {
  constructor(
    private subjectRepository: ISubjectRepository,
    private classRepository: IClassRepository
  ) {}

  async execute(grade: string, subjectData: Partial<SubjectEntity>): Promise<SubjectEntity> {
    try {
      const classesInGrade = await this.classRepository.findByGrade(grade);
      if (classesInGrade.length === 0) {
        throw new Error('No classes found for the specified grade');
      }

      for (const classItem of classesInGrade) {
        const subjectEntities = await this.subjectRepository.findByIds(classItem.subjects);
        const isDuplicate = subjectEntities.some(
          (subject) => subject.subjectName.toLowerCase() === subjectData.subjectName?.toLowerCase()
        );
        if (isDuplicate) {
          throw new Error(`Subject "${subjectData.subjectName}" already exists in grade ${grade}`);
        }
      }

      const newSubject = await this.subjectRepository.create(
        SubjectEntity.create({
          subjectName: subjectData.subjectName,
          teachers: subjectData.teachers || [],
          notes: subjectData.notes || [],
        })
      );

      for (const classItem of classesInGrade) {
        classItem.subjects.push(new Types.ObjectId(newSubject.id));
        await this.classRepository.update(classItem.id, {
          subjects: classItem.subjects,
        });
      }

      return newSubject;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create subject');
    }
  }
}