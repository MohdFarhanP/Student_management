import { ClassEntity } from '../../domain/entities/class';

export interface IGetClassesUseCase {
  execute(page: number, limit: number): Promise<{ data: ClassEntity[]; totalCount: number }>;
}