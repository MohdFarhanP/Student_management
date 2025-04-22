import { ClassEntity } from '../../domain/entities/class';

export interface IUpdateClassUseCase {
  execute(classId: string, updatedData: Partial<ClassEntity>): Promise<string>;
}