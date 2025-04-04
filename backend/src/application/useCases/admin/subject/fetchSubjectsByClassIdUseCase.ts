import { SubjectRepository } from '../../../../infrastructure/repositories/admin/subjectRepository.js';
import { ClassRepository } from '../../../../infrastructure/repositories/admin/classRepository.js';
import mongoose from 'mongoose';

export class FetchSubjectsByClassIdUseCase {
  constructor(
    private subjectRepository: SubjectRepository,
    private classRepository: ClassRepository
  ) {}

  async execute(classId: string) {
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      throw new Error('Invalid classId format');
    }

    const existingClass = await this.classRepository.findById(classId);
    if (!existingClass) {
      throw new Error('Class not found');
    }

    const subjectIds = existingClass.subjects;
    if (subjectIds.length === 0) {
      return [];
    }

    return await this.subjectRepository.findByIds(subjectIds);
  }
}
