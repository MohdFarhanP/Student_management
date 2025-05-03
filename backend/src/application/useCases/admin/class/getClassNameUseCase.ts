import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { IGetClassNameUseCase } from '../../../../domain/interface/IGetClassNameUseCase';

export class GetClassNameUseCase implements IGetClassNameUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(): Promise<{ grade: string }[]> {
    try {
      return await this.classRepository.findAllGrades();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch class names');
    }
  }
}