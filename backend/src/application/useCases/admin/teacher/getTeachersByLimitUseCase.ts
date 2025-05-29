import { ITeacherRepository } from '../../../../domain/repositories/ITeacherRepository';
import { IGetTeachersByLimitUseCase } from '../../../../domain/useCase/IGetTeachersByLimitUseCase';
import { TeacherEntity } from '../../../../domain/entities/teacher';

export class GetTeachersByLimitUseCase implements IGetTeachersByLimitUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute(
    page: number,
    limit: number
  ): Promise<{ teachers: TeacherEntity[]; totalCount: number }> {
    try {
      const result = await this.teacherRepository.getAllByLimit(page, limit);
      return { teachers: result.data, totalCount: result.totalCount };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch teachers');
    }
  }
}
