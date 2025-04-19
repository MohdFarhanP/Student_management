import { SubjectRepository } from '../../../../infrastructure/repositories/admin/subjectRepository';
import { ClassRepository } from '../../../../infrastructure/repositories/admin/classRepository';

export class GetSubjectsByClassUseCase {
  constructor(
    private subjectRepository: SubjectRepository,
    private classRepository: ClassRepository
  ) {}

  async execute(grade: string) {
    const existingClass = await this.classRepository.findByGrade(grade);
    if (!existingClass) {
      throw new Error('Class not found');
    }
    const subjectIds = [
      ...new Set(existingClass.flatMap((cls) => cls.subjects)),
    ];
    return await this.subjectRepository.findByIds(subjectIds);
  }
}
