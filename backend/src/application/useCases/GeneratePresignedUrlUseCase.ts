import { IFileValidator } from '../../domain/interface/IFileValidator';
     import { IStorageService } from '../../domain/interface/IStorageService';
     import { IGeneratePresignedUrlUseCase } from '../../domain/interface/IGeneratePresignedUrlUseCase';
     import { FileEntity } from '../../domain/entities/FileEntity';

     export class GeneratePresignedUrlUseCase implements IGeneratePresignedUrlUseCase {
       constructor(
         private readonly fileValidator: IFileValidator,
         private readonly storageService: IStorageService
       ) {}

       async execute(fileName: string, fileType: string): Promise<{ signedUrl: string; fileUrl: string }> {
         const file = new FileEntity(fileName, fileType, 0, Buffer.from(''));
         this.fileValidator.validate(file);
         return this.storageService.generatePresignedUrl(fileName, fileType);
       }
     }