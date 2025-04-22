import { Student } from '../entities/student';
import { IStudent } from '../types/interfaces';

export interface IEditStudentUseCase {
  execute(studentId: string, studentData: Partial<IStudent>): Promise<Student>;
}