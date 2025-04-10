import { Student } from '../../../domain/entities/student.js';
import { IStudentProfileRepository } from '../../../domain/interface/student/IStudentProfileRepository.js';

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
