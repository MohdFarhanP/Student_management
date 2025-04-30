import { IFileValidationService } from '../../domain/interface/IFileValidationService';
import { INoteRepository } from '../../domain/interface/INotRepository';
import { FileEntity } from '../../domain/entities/FileEntity';
import { FileType } from '../../domain/types/enums';
import { BadRequestError } from '../../domain/errors';

export class FileValidationService implements IFileValidationService {
  private readonly allowedTypes = Object.values(FileType);
  private readonly maxSize = 10 * 1024 * 1024; // 10MB

  constructor(private noteRepository: INoteRepository) {}

  async validate(file: FileEntity, fileHash: string): Promise<void> {
    const typeMap: { [key: string]: FileType } = {
      'application/pdf': FileType.PDF,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileType.DOCX,
      'image/jpeg': FileType.JPEG,
      'image/png': FileType.PNG,
      'image/gif': FileType.GIF,
    };
    const fileType = typeMap[file.type] || file.type;

    if (!this.allowedTypes.includes(fileType as FileType)) {
      throw new Error('Invalid file type. Only PDF, DOCX, and images (JPEG, PNG, GIF) are allowed.');
    }
    if (file.size > this.maxSize) {
      throw new Error('File size exceeds 10MB limit.');
    }
    if (!fileHash || !/^[0-9a-f]{64}$/i.test(fileHash)) {
      throw new Error('Valid SHA256 hash is required');
    }

    const existingNote = await this.noteRepository.findByHash(fileHash);
    if (existingNote) {
      throw new BadRequestError(`A file with the same content already exists ${existingNote.fileUrl}`);
    }
  }
}