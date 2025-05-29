import { FileEntity } from '../../domain/entities/FileEntity';

export interface IFileValidator {
  validate(file: FileEntity, fileHash: string): Promise<void>;
}
