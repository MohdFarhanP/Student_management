import { Note } from '../../domain/entities/note';

export interface IDownloadNoteUseCase {
  execute(noteId: string): Promise<Note>;
}