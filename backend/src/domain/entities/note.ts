import { Types } from 'mongoose';

export class Note {
  constructor(
    public id: string,
    public title: string,
    public fileUrl: string,
    public fileHash: string,
    public uploadedBy: string,
    public createdAt: Date
  ) {}

  static create(data: {
    title: string;
    fileUrl: string;
    fileHash: string;
    uploadedBy: string;
    createdAt?: Date;
    id?: string;
  }): Note {
    if (!data.title) throw new Error('Title is required');
    if (!data.fileUrl || !data.fileUrl.startsWith('https://')) {
      throw new Error('Valid HTTPS URL is required');
    }
    if (!data.uploadedBy || !Types.ObjectId.isValid(data.uploadedBy)) {
      throw new Error('Valid uploadedBy ID is required');
    }
    return new Note(
      data.id || new Types.ObjectId().toString(),
      data.title,
      data.fileUrl,
      data.fileHash,
      data.uploadedBy,
      data.createdAt || new Date()
    );
  }
}
