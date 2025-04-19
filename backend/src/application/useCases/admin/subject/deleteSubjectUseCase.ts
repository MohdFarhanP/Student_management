import { SubjectRepository } from '../../../../infrastructure/repositories/admin/subjectRepository';
import { ClassRepository } from '../../../../infrastructure/repositories/admin/classRepository';

export class DeleteSubjectUseCase {
  constructor(
    private subjectRepository: SubjectRepository,
    private classRepository: ClassRepository
  ) {}

  async execute(classGrade: string, subjectId: string) {
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

    await this.subjectRepository.delete(subjectId);

    await Promise.all(
      existingClassList.map(async (cls) => {
        const updateSubjects = await cls.subjects.filter(
          (id) => id.toString() !== subjectId.toString()
        );
        await this.classRepository.update(cls.grade, {
          subjects: updateSubjects,
        });
      })
    );

    return { message: 'Subject deleted successfully' };
  }
}
