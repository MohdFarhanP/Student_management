import { SubjectRepository } from '../../../../infrastructure/repositories/admin/subjectRepository';
import { ClassRepository } from '../../../../infrastructure/repositories/admin/classRepository';
import { SubjectEntity } from '../../../../domain/entities/subject';
import { Types } from 'mongoose';
import { ISubject } from '../../../../domain/interface/ISubject';

export class CreateSubjectUseCase {
  constructor(
    private subjectRepository: SubjectRepository,
    private classRepository: ClassRepository
  ) {}

  async execute(grade: string, subjectData: ISubject) {
    const classesInGrade = await this.classRepository.findByGrade(grade);
    console.log('CLASSES WITH GRADE:', classesInGrade);

    if (classesInGrade.length === 0) {
      throw new Error('No classes found for the specified grade');
    }

    for (const classItem of classesInGrade) {
      const subjectEntities = await this.subjectRepository.findByIds(
        classItem.subjects
      );

      const isDuplicate = subjectEntities.some(
        (subject) =>
          subject.subjectName.toLowerCase() ===
          subjectData.subjectName.toLowerCase()
      );
      if (isDuplicate) {
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
    return newSubject;
  }
}
