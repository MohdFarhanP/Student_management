import { Student } from '../entities/student';

export interface IGetStudentProfileUseCase {
  execute(email: string): Promise<Student | null>;
}