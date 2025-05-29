import { Schema } from 'mongoose';
import { INoteModel } from '../interface/INoteModel';

export const noteSchema = new Schema<INoteModel>({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileHash: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
