import { ISubjectRepository } from '../../../../domain/interface/ISubjectRepository';
import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { IDeleteSubjectUseCase } from '../../../../domain/interface/IDeleteSubjectUseCase';

export class DeleteSubjectUseCase implements IDeleteSubjectUseCase {
  constructor(
    private subjectRepository: ISubjectRepository,
    private classRepository: IClassRepository
  ) {}

  async execute(classGrade: string, subjectId: string): Promise<string> {
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

      await this.subjectRepository.delete(subjectId);

      await Promise.all(
        existingClassList.map(async (cls) => {
          const updatedSubjects = cls.subjects.filter((id) => id.toString() !== subjectId);
          await this.classRepository.update(cls.id, {
            subjects: updatedSubjects,
          });
        })
      );

      return 'Subject deleted successfully';
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete subject');
    }
  }
}