import { IClass } from '../types/interfaces';

export interface IGetClassForStudentUseCase {
  execute(studentId: string, role: string): Promise<Partial<IClass> | null>;
}
