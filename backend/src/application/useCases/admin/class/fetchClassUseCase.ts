import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { IFetchClassUseCase } from '../../../../domain/interface/IFetchClassUseCase';

export class FetchClassUseCase implements IFetchClassUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(): Promise<{ _id: string; name: string }[]> {
    try {
      return await this.classRepository.fetchClass();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch classes');
    }
  }
}