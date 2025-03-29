import { ITeacherProfileRepository } from '../../../domain/interface/teacher/ITeacherProfileRepository.js';
import { Teacher } from '../../../domain/entities/teacher.js';

export class GetTeacherProfileUseCase {
  constructor(private teacherRepository: ITeacherProfileRepository) {}

  async execute(email: string): Promise<Teacher> {
    const profile = await this.teacherRepository.getProfile(email);
    if (!profile) {
      throw new Error('Teacher profile not found');
    }
    return profile;
  }
}
