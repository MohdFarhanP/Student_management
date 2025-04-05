import { IStudentProfileRepository } from '../../../domain/interface/student/IStudentProfileRepository.js';
import { Student } from '../../../domain/entities/student.js';

export class UpdateStudentProfileImageUseCase {
  constructor(private studentRepository: IStudentProfileRepository) {}

  async execute(email: string, profileImage: string): Promise<Student> {
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
