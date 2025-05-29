import { INoteRepository } from '../../../domain/repositories/INotRepository';
import { IUploadNoteUseCase } from '../../../domain/useCase/IUploadNoteUseCase';
import { Note } from '../../../domain/entities/note';
import { BadRequestError } from '../../../domain/errors';

export class UploadNoteUseCase implements IUploadNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(
    title: string,
    fileUrl: string,
    fileHash: string,
    uploadedBy: string
  ): Promise<Note> {
    if (!title || !fileUrl || !fileHash || !uploadedBy) {
      throw new BadRequestError(
        'Title, fileUrl, fileHash, and uploadedBy are required'
      );
    }

    const note = Note.create({
      id: '',
      title,
      fileUrl,
      fileHash,
      uploadedBy,
      createdAt: new Date(),
    });

    return this.noteRepository.save(note);
  }
}
