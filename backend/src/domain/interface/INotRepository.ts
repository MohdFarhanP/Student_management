import { INote } from './INote.js';

export interface INoteRepository {
  save(note: INote): Promise<INote>;
  findById(id: string): Promise<INote | null>;
  findAll(): Promise<INote[]>;
}
