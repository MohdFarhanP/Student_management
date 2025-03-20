import { SubjectRepository } from '../../../infrastructure/repositories/subjectRepository.js';
import { ClassRepository } from '../../../infrastructure/repositories/classRepository.js';

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
