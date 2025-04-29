import { IStudentProfileRepository } from '../../../domain/interface/student/IStudentProfileRepository';
import { IUpdateStudentProfileImageUseCase } from '../../../domain/interface/IUpdateStudentProfileImageUseCase';
import { IStorageService } from '../../../domain/interface/IStorageService';

export class UpdateStudentProfileImageUseCase implements IUpdateStudentProfileImageUseCase {
  constructor(
    private readonly studentProfileRepository: IStudentProfileRepository,
    private readonly storageService: IStorageService
  ) {}

  async execute(studentId: string, file: File): Promise<string> {
    const { signedUrl, fileUrl } = await this.storageService.generatePresignedUrl(file.name, file.type);
    await fetch(signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    await this.studentProfileRepository.updateProfileImage(studentId, fileUrl);
    return fileUrl;
  }
}