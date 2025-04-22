import { Teacher } from '../../../domain/entities/teacher';
import { ITeacherProfileRepository } from '../../../domain/interface/teacher/ITeacherProfileRepository';
import { IUpdateTeacherProfileUseCase } from '../../../domain/interface/IUpdateTeacherProfileUseCase';

export class UpdateTeacherProfileUseCase implements IUpdateTeacherProfileUseCase {
  constructor(private teacherRepository: ITeacherProfileRepository) {}

  async execute(profile: Partial<Teacher>): Promise<Teacher | null> {
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