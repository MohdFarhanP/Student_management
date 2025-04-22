import { INoteRepository } from '../../../domain/interface/INotRepository';
import { IListNotesUseCase } from '../../../domain/interface/IListNotesUseCase';
import { Note } from '../../../domain/entities/note';

export class ListNotesUseCase implements IListNotesUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(): Promise<Note[]> {
    return this.noteRepository.findAll();
  }
}