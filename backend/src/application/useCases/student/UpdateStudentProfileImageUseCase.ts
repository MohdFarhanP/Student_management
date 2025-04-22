import { IStudentProfileRepository } from '../../../domain/interface/student/IStudentProfileRepository';
import { Student } from '../../../domain/entities/student';

export class UpdateStudentProfileImageUseCase {
  constructor(private studentRepository: IStudentProfileRepository) {}

  async execute(email: string, profileImage: string): Promise<Student> {
    if (!email || !email.includes('@')) {
      throw new Error('Valid email is required');
    }
    if (!profileImage || typeof profileImage !== 'string') {
      throw new Error('Valid profileImage URL is required');
    }
    const updatedProfile = await this.studentRepository.updateProfileImage(
      email,
      profileImage
    );
    if (!updatedProfile) {
      throw new Error('Student profile not found or update failed');
    }
    return updatedProfile;
  }
}