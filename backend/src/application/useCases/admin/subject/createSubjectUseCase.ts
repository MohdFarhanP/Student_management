import { ISubjectRepository } from '../../../../domain/repositories/ISubjectRepository';
import { IClassRepository } from '../../../../domain/repositories/IClassRepository';
import { SubjectEntity } from '../../../../domain/entities/subject';
import { Types } from 'mongoose';
import { ICreateSubjectUseCase } from '../../../../domain/useCase/ICreateSubjectUseCase';

export class CreateSubjectUseCase implements ICreateSubjectUseCase {
  constructor(
    private subjectRepository: ISubjectRepository,
    private classRepository: IClassRepository
  ) {}

  async execute(
    grade: string,
    subjectData: Partial<SubjectEntity>
  ): Promise<SubjectEntity> {
    try {
      const classesInGrade = await this.classRepository.findByGrade(grade);
      if (classesInGrade.length === 0) {
        throw new Error('No classes found for the specified grade');
      }

      const allSubjectIds = [
        ...new Set(classesInGrade.flatMap((c) => c.subjects)),
      ].map((id) => new Types.ObjectId(id));

      const allSubjects = await this.subjectRepository.findByIds(allSubjectIds);

      const duplicate = allSubjects.some(
        (subject) =>
          subject.subjectName.toLowerCase() ===
          subjectData.subjectName?.toLowerCase()
      );

      if (duplicate) {
        throw new Error(
          `Subject "${subjectData.subjectName}" already exists in grade ${grade}`
        );
      }

      const newSubject = await this.subjectRepository.create(
        SubjectEntity.create({
          subjectName: subjectData.subjectName,
          teachers: subjectData.teachers || [],
          notes: subjectData.notes || [],
        })
      );

      await Promise.all(
        classesInGrade.map((classItem) => {
          classItem.subjects.push(newSubject.id);
          return this.classRepository.update(classItem.id, {
            subjects: classItem.subjects,
          });
        })
      );

      return newSubject;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to create subject');
    }
  }
}
