import { Note } from '../../domain/entities/note';

export interface IUploadNoteUseCase {
  execute(title: string, fileUrl: string, uploadedBy: string): Promise<Note>;
}