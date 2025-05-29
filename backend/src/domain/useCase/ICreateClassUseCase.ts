import { IClass } from '../types/interfaces';

export interface ICreateClassUseCase {
  execute(classData: Partial<IClass>): Promise<string>;
}
