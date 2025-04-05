import { Teacher } from '../../../domain/entities/teacher.js';
import { ITeacherProfileRepository } from '../../../domain/interface/teacher/ITeacherProfileRepository.js';

export class UpdateTeacherProfileUseCase {
  constructor(private teacherRepository: ITeacherProfileRepository) {}
  async execute(profile: Partial<Teacher>): Promise<Teacher | null> {
    if (!profile.email) {
      throw new Error('Email is required to update profile');
    }
    const updatedProfile = await this.teacherRepository.updateProfile(profile);
    if (!updatedProfile) {
      throw new Error('Failed to update profile');
    }
    return updatedProfile;
  }
}
