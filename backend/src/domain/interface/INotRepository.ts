import { Note } from '../entities/note';

export interface INoteRepository {
  save(note: Note): Promise<Note>;
  findById(id: string): Promise<Note | null>;
  findAll(): Promise<Note[]>;
}