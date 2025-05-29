import { IClassRepository } from '../../../../domain/repositories/IClassRepository';
import { IFetchTopClassUseCase } from '../../../../domain/useCase/IFetchTopClassUseCase';
import { TopClassDto } from '../../../dtos/classDtos';

export class FetchTopClassUseCase implements IFetchTopClassUseCase {
  constructor(private readonly classRepository: IClassRepository) {}

  async execute(limit: number = 5): Promise<TopClassDto[]> {
    const result = this.classRepository.getTopClasses(limit);
    return result;
  }
}
