import { SubjectRepository } from '../../../infrastructure/repositories/subjectRepository.js';
import { ClassRepository } from '../../../infrastructure/repositories/classRepository.js';
import { SubjectEntity } from '../../../domain/entities/subject.js';
import { Types } from 'mongoose';

export class CreateSubjectUseCase {
  constructor(
    private subjectRepository: SubjectRepository,
    private classRepository: ClassRepository
  ) {}

  async execute(grade: string, subjectData: Omit<SubjectEntity, 'id'>) {
    const classesInGrade = await this.classRepository.findByGrade(grade);
    console.log('CLASSES WITH GRADE:', classesInGrade);

    if (classesInGrade.length === 0) {
      throw new Error('No classes found for the specified grade');
    }

    for (const classItem of classesInGrade) {
      const existingSubject = await this.subjectRepository.findByName(
        subjectData.subjectName
      );
      if (
        existingSubject &&
        classItem.subjects.some((subjectId) =>
          subjectId.equals(new Types.ObjectId(existingSubject.id as string))
        )
      ) {
        throw new Error(
          `Subject "${subjectData.subjectName}" already exists in grade ${grade}`
        );
      }
    }

    const notes =
      subjectData.notes && Array.isArray(subjectData.notes)
        ? subjectData.notes
        : [];

    const newSubject = await this.subjectRepository.create(
      new SubjectEntity(
        undefined,
        subjectData.subjectName,
        subjectData.teachers,
        notes
      )
    );

    for (const classItem of classesInGrade) {
      classItem.subjects.push(new Types.ObjectId(newSubject.id as string));
      await this.classRepository.update(classItem.id, {
        subjects: classItem.subjects,
      });
    }
    return 'New subject created successfully';
  }
}
