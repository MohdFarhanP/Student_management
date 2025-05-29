import { ITeacherProfileRepository } from '../../../domain/repositories/ITeacherProfileRepository';
import { TeacherEntity } from '../../../domain/entities/teacher';
import { IGetTeacherProfileUseCase } from '../../../domain/useCase/IGetTeacherProfileUseCase';

export class GetTeacherProfileUseCase implements IGetTeacherProfileUseCase {
  constructor(private teacherRepository: ITeacherProfileRepository) {}

  async execute(email: string): Promise<TeacherEntity> {
    if (!email || !email.includes('@')) {
      throw new Error('Valid email is required');
    }
    const profile = await this.teacherRepository.getProfile(email);
    if (!profile) {
      throw new Error('Teacher profile not found');
    }
    return profile;
  }
}
