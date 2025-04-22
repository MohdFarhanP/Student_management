import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository';
import { IGetTeachersByLimitUseCase } from '../../../../domain/interface/IGetTeachersByLimitUseCase';
import { Teacher } from '../../../../domain/entities/teacher';

export class GetTeachersByLimitUseCase implements IGetTeachersByLimitUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute(page: number, limit: number): Promise<{ teachers: Teacher[]; totalCount: number }> {
    try {
      const result = await this.teacherRepository.getAllByLimit(page, limit);
      return { teachers: result.data, totalCount: result.totalCount };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch teachers');
    }
  }
}