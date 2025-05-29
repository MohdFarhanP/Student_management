import { TeacherEntity } from '../../../domain/entities/teacher';
import { ITeacherProfileRepository } from '../../../domain/repositories/ITeacherProfileRepository';
import { IUpdateTeacherProfileUseCase } from '../../../domain/useCase/IUpdateTeacherProfileUseCase';

export class UpdateTeacherProfileUseCase
  implements IUpdateTeacherProfileUseCase
{
  constructor(private teacherRepository: ITeacherProfileRepository) {}

  async execute(
    profile: Partial<TeacherEntity>
  ): Promise<TeacherEntity | null> {
    if (!profile.email || !profile.email.includes('@')) {
      throw new Error('Valid email is required to update profile');
    }
    const updatedProfile = await this.teacherRepository.updateProfile(profile);
    if (!updatedProfile) {
      throw new Error('Failed to update profile');
    }
    return updatedProfile;
  }
}
