import { IFileValidationService } from '../services/IFileValidationService';
import { IStorageService } from '../services/IStorageService';
import { IGeneratePresignedUrlUseCase } from '../../domain/useCase/IGeneratePresignedUrlUseCase';
import { FileEntity } from '../../domain/entities/FileEntity';
import { BadRequestError } from '../../domain/errors';

export class GeneratePresignedUrlUseCase
  implements IGeneratePresignedUrlUseCase
{
  constructor(
    private fileValidationService: IFileValidationService,
    private storageService: IStorageService
  ) {}

  async execute(
    fileName: string,
    fileType: string,
    fileHash: string,
    fileSize?: number
  ): Promise<{ signedUrl: string; fileUrl: string }> {
    if (!fileName || !fileType || !fileHash) {
      throw new BadRequestError(
        'fileName, fileType, and fileHash are required'
      );
    }
    const file = new FileEntity(fileName, fileType, fileSize ?? 0);
    await this.fileValidationService.validate(file, fileHash);
    return this.storageService.generatePresignedUrl(fileName, fileType);
  }
}
