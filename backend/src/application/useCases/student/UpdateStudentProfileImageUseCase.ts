import { IStudentProfileRepository } from '../../../domain/interface/student/IStudentProfileRepository';
import { IUpdateStudentProfileImageUseCase } from '../../../domain/interface/IUpdateStudentProfileImageUseCase';
import { Student } from '../../../domain/entities/student';
import { BadRequestError, NotFoundError } from '../../../domain/errors';

export class UpdateStudentProfileImageUseCase implements IUpdateStudentProfileImageUseCase {
  constructor(private studentRepository: IStudentProfileRepository) {}

  async execute(email: string, profileImage: string): Promise<Student> {
    if (!email || !email.includes('@')) {
      throw new BadRequestError('Valid email is required');
    }
    if (!profileImage || typeof profileImage !== 'string') {
      throw new BadRequestError('Valid profileImage URL is required');
    }
    const updatedProfile = await this.studentRepository.updateProfileImage(
      email,
      profileImage
    );
    if (!updatedProfile) {
      throw new NotFoundError('Student profile not found or update failed');
    }
    return updatedProfile;
  }
}