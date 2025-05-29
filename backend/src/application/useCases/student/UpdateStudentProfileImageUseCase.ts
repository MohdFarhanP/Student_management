import { IStudentProfileRepository } from '../../../domain/repositories/IStudentProfileRepository';
import { IUpdateStudentProfileImageUseCase } from '../../../domain/useCase/IUpdateStudentProfileImageUseCase';
import { IStorageService } from '../../services/IStorageService';

export class UpdateStudentProfileImageUseCase
  implements IUpdateStudentProfileImageUseCase
{
  constructor(
    private readonly studentProfileRepository: IStudentProfileRepository,
    private readonly storageService: IStorageService
  ) {}

  async execute(
    studentId: string,
    fileUrl: string,
    fileHash: string
  ): Promise<string> {
    const student = await this.studentProfileRepository.updateProfileImage(
      studentId,
      fileUrl,
      fileHash
    );
    return student.profileImage;
  }
}
