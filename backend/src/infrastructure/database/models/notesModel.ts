import { Schema, model } from 'mongoose';
import { INote } from '../../../domain/interface/INote';

const noteSchema = new Schema<INote>({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileHash: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const NoteModel = model<INote>('Note', noteSchema);