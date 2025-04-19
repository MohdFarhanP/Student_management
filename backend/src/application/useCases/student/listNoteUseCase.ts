import { INote } from '../../../domain/interface/INote';
import { INoteRepository } from '../../../domain/interface/INotRepository';

export class ListNotes {
  constructor(private noteRepository: INoteRepository) {}

  async execute(): Promise<INote[]> {
    return this.noteRepository.findAll();
  }
}

export { ListNotes as ListNotesImpl };
