import { INoteRepository } from '../../../domain/repositories/INotRepository';
import { IDownloadNoteUseCase } from '../../../domain/useCase/IDownloadNoteUseCase';
import { Note } from '../../../domain/entities/note';
import { NotFoundError } from '../../../domain/errors';

export class DownloadNoteUseCase implements IDownloadNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(noteId: string): Promise<Note> {
    const note = await this.noteRepository.findById(noteId);
    if (!note) {
      throw new NotFoundError('Note not found');
    }
    return note;
  }
}
