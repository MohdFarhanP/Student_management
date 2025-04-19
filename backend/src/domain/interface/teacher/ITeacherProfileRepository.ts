import { Teacher } from '../../entities/teacher';

export interface ITeacherProfileRepository {
  getProfile(email: string): Promise<Teacher | null>;
  updateProfile(profile: Partial<Teacher>): Promise<Teacher | null>;
}
