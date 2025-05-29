import { TeacherEntity } from '../entities/teacher';

export interface ITeacherProfileRepository {
  getProfile(email: string): Promise<TeacherEntity | null>;
  updateProfile(profile: Partial<TeacherEntity>): Promise<TeacherEntity | null>;
}
