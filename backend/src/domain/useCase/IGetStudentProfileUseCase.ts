import { StudentEntity as Student } from '../entities/student';

export interface IGetStudentProfileUseCase {
  execute(email: string): Promise<Student | null>;
}
