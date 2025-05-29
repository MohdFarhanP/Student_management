import { ISubjectRepository } from '../../../../domain/repositories/ISubjectRepository';
import { IClassRepository } from '../../../../domain/repositories/IClassRepository';
import { IFetchSubjectsByClassIdUseCase } from '../../../../domain/useCase/IFetchSubjectsByClassIdUseCase';
import mongoose, { Types } from 'mongoose';
import { SubjectEntity } from '../../../../domain/entities/subject';

export class FetchSubjectsByClassIdUseCase
  implements IFetchSubjectsByClassIdUseCase
{
  constructor(
    private subjectRepository: ISubjectRepository,
    private classRepository: IClassRepository
  ) {}

  async execute(classId: string): Promise<SubjectEntity[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error('Invalid classId format');
      }

      const existingClass = await this.classRepository.findById(classId);
      if (!existingClass) {
        throw new Error('Class not found');
      }

      const subjectIds = existingClass.subjects.map(
        (id) => new Types.ObjectId(id)
      );
      if (subjectIds.length === 0) {
        return [];
      }

      return await this.subjectRepository.findByIds(subjectIds);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch subjects');
    }
  }
}
