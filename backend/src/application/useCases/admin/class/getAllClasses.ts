import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { IGetClassesUseCase } from '../../../../domain/interface/IGetClassesUseCase';
import { ClassEntity } from '../../../../domain/entities/class';

export class GetClassesUseCase implements IGetClassesUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(page: number, limit: number): Promise<{ data: ClassEntity[]; totalCount: number }> {
    try {
      return await this.classRepository.findAll(page, limit);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch classes');
    }
  }
}