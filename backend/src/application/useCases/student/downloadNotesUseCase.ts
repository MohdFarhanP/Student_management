import { INote } from '../../../domain/interface/INote';
import { INoteRepository } from '../../../domain/interface/INotRepository';

class DownloadNote {
  constructor(private noteRepository: INoteRepository) {}

  async execute(noteId: string): Promise<INote> {
    const note = await this.noteRepository.findById(noteId);
    if (!note) throw new Error('Note not found');
    return note;
  }
}
export { DownloadNote as DownloadNoteImpl };
