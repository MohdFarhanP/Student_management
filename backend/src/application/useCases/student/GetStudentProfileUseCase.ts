import { IStudentProfileRepository } from '../../../domain/repositories/IStudentProfileRepository';
import { IGetStudentProfileUseCase } from '../../../domain/useCase/IGetStudentProfileUseCase';
import { StudentEntity } from '../../../domain/entities/student';

export class GetStudentProfileUseCase implements IGetStudentProfileUseCase {
  constructor(private studentRepository: IStudentProfileRepository) {}

  async execute(email: string): Promise<StudentEntity | null> {
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Valid email is required');
      }
      const profile = await this.studentRepository.getProfile(email);
      if (!profile) {
        throw new Error('Student profile not found');
      }
      return profile;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch student profile');
    }
  }
}
