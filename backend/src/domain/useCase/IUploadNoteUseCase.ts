import { Note } from '../entities/note';

export interface IUploadNoteUseCase {
  execute(
    title: string,
    fileUrl: string,
    fileHash: string,
    uploadedBy: string
  ): Promise<Note>;
}
