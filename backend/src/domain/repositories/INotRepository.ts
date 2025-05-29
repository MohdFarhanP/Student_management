import { Note } from '../entities/note';

export interface INoteRepository {
  save(note: Note): Promise<Note>;
  findByHash(fileHash: string): Promise<Note | null>;
  findById(id: string): Promise<Note | null>;
  findAll(): Promise<Note[]>;
}
