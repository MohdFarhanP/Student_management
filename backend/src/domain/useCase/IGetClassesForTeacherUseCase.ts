import { IClass } from '../types/interfaces';

export interface IGetClassesForTeacherUseCase {
  execute(teacherId: string, role: string): Promise<Partial<IClass>[]>;
}
