import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { IFetchTopClassUseCase } from '../../../../domain/interface/IFetchTopClassUseCase';
import { TopClassDto } from '../../../../domain/types/interfaces';

export class FetchTopClassUseCase implements IFetchTopClassUseCase{
  constructor(private readonly classRepository: IClassRepository) {}

  async execute(limit: number = 5): Promise<TopClassDto[]> {
    const result = this.classRepository.getTopClasses(limit);
    return result;
  }
}