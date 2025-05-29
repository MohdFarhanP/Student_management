import { Document } from 'mongoose';

export interface INoteModel extends Document {
  title: string;
  fileUrl: string;
  fileHash: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
