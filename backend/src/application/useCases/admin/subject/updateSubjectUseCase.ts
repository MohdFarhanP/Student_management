import { ISubjectRepository } from '../../../../domain/interface/ISubjectRepository';
import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { SubjectEntity } from '../../../../domain/entities/subject';
import { IUpdateSubjectUseCase } from '../../../../domain/interface/IUpdateSubjectUseCase';

export class UpdateSubjectUseCase implements IUpdateSubjectUseCase {
  constructor(
    private subjectRepository: ISubjectRepository,
    private classRepository: IClassRepository
  ) {}

  async execute(classGrade: string, subjectId: string, updatedData: Partial<SubjectEntity>): Promise<SubjectEntity> {
    try {
      const existingClassList = await this.classRepository.findByGrade(classGrade);
      if (!existingClassList || existingClassList.length === 0) {
        throw new Error('No classes found for the specified grade');
      }

      const subjectExistInAny = existingClassList.some((cls) =>
        cls.subjects.some((id) => id.toString() === subjectId)
      );
      if (!subjectExistInAny) {
        throw new Error('Subject not found in the specified class');
      }

      const updatedSubject = await this.subjectRepository.update(subjectId, updatedData);
      if (!updatedSubject) {
        throw new Error('Failed to update subject');
      }

      return updatedSubject;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update subject');
    }
  }
}