import { IClassRepository } from '../../../../domain/repositories/IClassRepository';
import { IGetClassesByIdUseCase } from '../../../../domain/useCase/IGetClassesByIdUseCase';
import { IClassData } from '../../../dtos/classDtos';

export class GetClassesByIdUseCase implements IGetClassesByIdUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(userId: string): Promise<IClassData> {
    try {
      const classInfo = await this.classRepository.findByUserId(userId);
      return classInfo;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch classes');
    }
  }
}
