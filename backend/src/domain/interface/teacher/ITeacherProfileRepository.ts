import { Teacher } from '../../entities/teacher.js';

export interface ITeacherProfileRepository {
  getProfile(email: string): Promise<Teacher | null>;
  updateProfile(profile: Partial<Teacher>): Promise<Teacher | null>;
}
