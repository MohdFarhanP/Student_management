import { StudentEntity } from '../entities/student';
import { IStudent } from '../types/interfaces';

export interface IAddStudentUseCase {
  execute(studentData: Partial<IStudent>): Promise<StudentEntity>;
}
