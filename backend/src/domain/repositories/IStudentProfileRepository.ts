import { StudentEntity } from '../entities/student';

export interface IStudentProfileRepository {
  getProfile(email: string): Promise<StudentEntity | null>;
  updateProfileImage(
    email: string,
    profileImage: string,
    fileHash: string
  ): Promise<StudentEntity | null>;
  getStudentInfo(userId: string): Promise<StudentEntity | null>;
}
