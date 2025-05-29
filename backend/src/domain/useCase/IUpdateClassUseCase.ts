import { IClass } from '../types/interfaces';

export interface IUpdateClassUseCase {
  execute(classId: string, updatedData: Partial<IClass>): Promise<string>;
}
