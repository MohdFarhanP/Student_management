import { INote } from '../../../domain/interface/INote.js';
import { INoteRepository } from '../../../domain/interface/INotRepository.js';

export class ListNotes {
  constructor(private noteRepository: INoteRepository) {}

  async execute(): Promise<INote[]> {
    return this.noteRepository.findAll();
  }
}

export { ListNotes as ListNotesImpl };
