import { Student } from '../../../domain/entities/student';
import { IStudentProfileRepository } from '../../../domain/interface/student/IStudentProfileRepository';

export class GetStudentProfileUseCase {
  constructor(private studentRepository: IStudentProfileRepository) {}

  async execute(email: string): Promise<Student> {
    const profile = await this.studentRepository.getProfile(email);
    if (!profile) {
      throw new Error('Student profile not found');
    }
    return profile;
  }
}
