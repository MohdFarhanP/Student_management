import { StudentEntity as Student } from '../entities/student';

export interface IGetStudentsByClassUseCase {
  execute(classId: string): Promise<Student[]>;
}
