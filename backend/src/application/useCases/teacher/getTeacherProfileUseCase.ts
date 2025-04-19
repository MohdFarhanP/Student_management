import { ITeacherProfileRepository } from '../../../domain/interface/teacher/ITeacherProfileRepository';
import { Teacher } from '../../../domain/entities/teacher';

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
