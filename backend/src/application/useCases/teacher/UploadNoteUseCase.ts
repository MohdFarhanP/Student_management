import { INoteRepository } from '../../../domain/interface/INotRepository';
import { IUploadNoteUseCase } from '../../../domain/interface/IUploadNoteUseCase';
import { Note } from '../../../domain/entities/note';
import { BadRequestError } from '../../../domain/errors';

export class UploadNoteUseCase implements IUploadNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(title: string, fileUrl: string, uploadedBy: string): Promise<Note> {
    if (!title || !fileUrl || !uploadedBy) {
      throw new BadRequestError('Title, fileUrl, and uploadedBy are required');
    }

    const note = Note.create({
      id: '', // ID will be set by repository
      title,
      fileUrl,
      uploadedBy,
      createdAt: new Date(),
    });

    return this.noteRepository.save(note);
  }
}