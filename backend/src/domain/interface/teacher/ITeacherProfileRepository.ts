import { Teacher } from '../../entities/teacher.js';

export interface ITeacherProfileRepository {
  getProfile(email: string): Promise<Teacher | null>;
}
