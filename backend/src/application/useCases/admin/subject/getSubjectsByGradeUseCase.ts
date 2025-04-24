import { ISubjectRepository } from '../../../../domain/interface/ISubjectRepository';
import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { IGetSubjectsByGradeUseCase } from '../../../../domain/interface/IGetSubjectsByGradeUseCase';
import { SubjectEntity } from '../../../../domain/entities/subject';

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

      const subjectIds = [...new Set(existingClasses.flatMap((cls) => cls.subjects))];
      return  await this.subjectRepository.findByIds(subjectIds);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch subjects');
    }
  }
}