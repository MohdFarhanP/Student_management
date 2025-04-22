import { Student } from '../../domain/entities/student';

export interface IGetStudentsByClassUseCase {
  execute(classId: string): Promise<Student[]>;
}