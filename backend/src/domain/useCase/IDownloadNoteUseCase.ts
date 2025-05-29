import { Note } from '../entities/note';

export interface IDownloadNoteUseCase {
  execute(noteId: string): Promise<Note>;
}
