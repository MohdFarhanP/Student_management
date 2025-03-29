import { Student } from '../../entities/student.js';

export interface IStudentProfileRepository {
  getProfile(email: string): Promise<Student | null>;
}
