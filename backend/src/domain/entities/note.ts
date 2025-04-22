import { Types } from 'mongoose';

export class Note {
  constructor(
    public id: string,
    public title: string,
    public fileUrl: string,
    public uploadedBy: string,
    public createdAt: Date
  ) {}

  static create(data: {
    title: string;
    fileUrl: string;
    uploadedBy: string;
    createdAt?: Date;
    id?: string;
  }): Note {
    if (!data.title) throw new Error('Title is required');
    if (!data.fileUrl || !data.fileUrl.startsWith('https://res.cloudinary.com')) {
      throw new Error('Valid Cloudinary URL is required');
    }
    if (!data.uploadedBy || !Types.ObjectId.isValid(data.uploadedBy)) {
      throw new Error('Valid uploadedBy ID is required');
    }
    return new Note(
      data.id || new Types.ObjectId().toString(),
      data.title,
      data.fileUrl,
      data.uploadedBy,
      data.createdAt || new Date()
    );
  }
}