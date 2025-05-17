import { Student } from '../../../domain/entities/student';

export interface IStudentProfileRepository {
  getProfile(email: string): Promise<Student | null>;
  updateProfileImage(
    email: string,
    profileImage: string,
    fileHash: string,
  ): Promise<Student | null>;
}
