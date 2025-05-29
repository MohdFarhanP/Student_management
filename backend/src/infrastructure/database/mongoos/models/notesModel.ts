import { model } from 'mongoose';
import { INoteModel } from '../interface/INoteModel';
import { noteSchema } from '../scheema/noteSchema';

export const NoteModel = model<INoteModel>('Note', noteSchema);
