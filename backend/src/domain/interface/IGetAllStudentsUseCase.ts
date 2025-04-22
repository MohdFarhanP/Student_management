import { Student } from '../entities/student';

export interface IGetAllStudentsUseCase {
  execute(page: number, limit: number): Promise<{ students: Student[]; totalCount: number }>;
}