import { Student } from '../../../domain/entities/student.js';

export interface IStudentProfileRepository {
  getProfile(email: string): Promise<Student | null>;
  updateProfileImage(
    email: string,
    profileImage: string
  ): Promise<Student | null>;
}
