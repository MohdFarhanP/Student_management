import { Student } from '../entities/student.js';

export interface IStudentRepository {
  getStudents(
    page: number,
    limit: number
  ): Promise<{ students: Student[]; totalCount: number }>;
}
