import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { IGetClassesByIdUseCase } from '../../../../domain/interface/IGetClassesByIdUseCase';
import { IClassData } from '../../../../domain/types/interfaces';

export class GetClassesByIdUseCase implements IGetClassesByIdUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(userId:string): Promise<IClassData> {
    try {
      const classInfo = await this.classRepository.findByUserId(userId);
      return classInfo ;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch classes');
    }
  }
}