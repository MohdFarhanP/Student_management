import { IFileValidationService } from '../../domain/interface/IFileValidationService';
import { FileEntity } from '../../domain/entities/FileEntity';
import { FileType } from '../../domain/types/enums';

export class FileValidationService implements IFileValidationService {
  private readonly allowedTypes = Object.values(FileType);
  private readonly maxSize = 10 * 1024 * 1024; // 10MB

  validate(file: FileEntity): void {
    if (!this.allowedTypes.includes(file.type as FileType)) {
      throw new Error('Invalid file type. Only PDF, DOCX, and images (JPEG, PNG, GIF) are allowed.');
    }
    if (file.size > this.maxSize) {
      throw new Error('File size exceeds 10MB limit.');
    }
  }
}