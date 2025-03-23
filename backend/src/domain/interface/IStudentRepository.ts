import { Student } from '../entities/student.js';

export interface IStudentRepository {
  insertMany(data: []): Promise<void>;
  getAll(
    page: number,
    limit: number
  ): Promise<{ students: Student[]; totalCount: number }>;
}
