import { Student } from '../../../domain/entities/student.js';
import { IStudentRepository } from '../../../domain/interface/admin/IStudentRepository.js';

export class GetStudentProfileUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(email: string): Promise<Student> {
    const profile = await this.studentRepository.getProfile(email);
    if (!profile) {
      throw new Error('Student profile not found');
    }
    return profile;
  }
}
