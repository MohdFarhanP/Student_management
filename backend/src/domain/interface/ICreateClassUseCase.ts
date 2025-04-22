import { ClassEntity } from '../../domain/entities/class';

export interface ICreateClassUseCase {
  execute(classData: Omit<ClassEntity, 'id'>): Promise<string>;
}