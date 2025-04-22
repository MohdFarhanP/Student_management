import { INoteRepository } from '../../../domain/interface/INotRepository';
import { IUploadNoteUseCase } from '../../../domain/interface/IUploadNoteUseCase';
import { Note } from '../../../domain/entities/note';
import { BadRequestError } from '../../../domain/errors';

export class UploadNoteUseCase implements IUploadNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(title: string, fileUrl: string, uploadedBy: string): Promise<Note> {
    const note = Note.create({ title, fileUrl, uploadedBy });
    return this.noteRepository.save(note);
  }
}