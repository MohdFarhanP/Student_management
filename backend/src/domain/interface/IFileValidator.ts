import { FileEntity } from '../entities/FileEntity';

export interface IFileValidator {
  validate(file: FileEntity): void;
}