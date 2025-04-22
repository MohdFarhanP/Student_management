import { Note } from "../entities/note";

export interface IListNotesUseCase {
  execute(): Promise<Note[]>;
}