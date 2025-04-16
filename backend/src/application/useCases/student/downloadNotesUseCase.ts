import { INote } from '../../../domain/interface/INote.js';
import { INoteRepository } from '../../../domain/interface/INotRepository.js';

class DownloadNote {
  constructor(private noteRepository: INoteRepository) {}

  async execute(noteId: string): Promise<INote> {
    const note = await this.noteRepository.findById(noteId);
    if (!note) throw new Error('Note not found');
    return note;
  }
}
export { DownloadNote as DownloadNoteImpl };
