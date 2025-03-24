import { Student } from '../entities/student.js';

export interface IStudentRepository {
  insertMany(data: Student[]): Promise<void>;
  getAll(
    page: number,
    limit: number
  ): Promise<{ students: Student[]; totalCount: number }>;
}
