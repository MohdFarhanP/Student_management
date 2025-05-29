import { ISubjectRepository } from '../../../../domain/repositories/ISubjectRepository';
import { IClassRepository } from '../../../../domain/repositories/IClassRepository';
import { IGetSubjectsByGradeUseCase } from '../../../../domain/useCase/IGetSubjectsByGradeUseCase';
import { SubjectEntity } from '../../../../domain/entities/subject';
import { Types } from 'mongoose';

export class GetSubjectsByGradeUseCase implements IGetSubjectsByGradeUseCase {
  constructor(
    private subjectRepository: ISubjectRepository,
    private classRepository: IClassRepository
  ) {}

  async execute(grade: string): Promise<SubjectEntity[]> {
    try {
      const existingClasses = await this.classRepository.findByGrade(grade);
      if (!existingClasses || existingClasses.length === 0) {
        throw new Error('No classes found for the specified grade');
      }

      const subjectIds = [
        ...new Set(existingClasses.flatMap((cls) => cls.subjects)),
      ].map((id) => new Types.ObjectId(id));
      return await this.subjectRepository.findByIds(subjectIds);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch subjects');
    }
  }
}
