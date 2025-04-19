import { SubjectRepository } from '../../../../infrastructure/repositories/admin/subjectRepository';
import { ClassRepository } from '../../../../infrastructure/repositories/admin/classRepository';
import { SubjectEntity } from '../../../../domain/entities/subject';

export class UpdateSubjectUseCase {
  constructor(
    private subjectRepository: SubjectRepository,
    private classRepository: ClassRepository
  ) {}

  async execute(
    classGrade: string,
    subjectId: string,
    updatedData: Partial<SubjectEntity>
  ) {
    const existingClassList =
      await this.classRepository.findByGrade(classGrade);

    if (!existingClassList || existingClassList.length === 0) {
      throw new Error('No classes found for the specified grade');
    }
    const subjectExistInAny = existingClassList.some((cls) =>
      cls.subjects.some((id) => id.toString() === subjectId.toString())
    );
    if (!subjectExistInAny) {
      throw new Error('Subject not found in the specified class');
    }

    return await this.subjectRepository.update(subjectId, updatedData);
  }
}
