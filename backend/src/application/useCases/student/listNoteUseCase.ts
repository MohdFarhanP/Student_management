import { INoteRepository } from '../../../domain/repositories/INotRepository';
import { IListNotesUseCase } from '../../../domain/useCase/IListNotesUseCase';
import { Note } from '../../../domain/entities/note';

export class ListNotesUseCase implements IListNotesUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(): Promise<Note[]> {
    return this.noteRepository.findAll();
  }
}
