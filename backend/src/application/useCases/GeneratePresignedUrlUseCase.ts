import { IFileValidationService } from '../../domain/interface/IFileValidationService';
import { IStorageService } from '../../domain/interface/IStorageService';
import { IGeneratePresignedUrlUseCase } from '../../domain/interface/IGeneratePresignedUrlUseCase';
import { INoteRepository } from '../../domain/interface/INotRepository';
import { FileEntity } from '../../domain/entities/FileEntity';
import { BadRequestError } from '../../domain/errors';

export class GeneratePresignedUrlUseCase implements IGeneratePresignedUrlUseCase {
  constructor(
    private fileValidationService: IFileValidationService,
    private storageService: IStorageService,
  ) {}

  async execute(fileName: string, fileType: string, fileHash: string, fileSize?: number): Promise<{ signedUrl: string; fileUrl: string }> {
    if (!fileName || !fileType || !fileHash) {
      throw new BadRequestError('fileName, fileType, and fileHash are required');
    }
    const file = new FileEntity(fileName, fileType, fileSize ?? 0);
    await this.fileValidationService.validate(file, fileHash);
    return this.storageService.generatePresignedUrl(fileName, fileType);
  }
}