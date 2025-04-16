import { INote } from '../../domain/interface/INote.js';
import { INoteRepository } from '../../domain/interface/INotRepository.js';
import { NoteModel } from '../database/models/notesModel.js';

export class NoteRepositoryImpl implements INoteRepository {
  async save(note: INote): Promise<INote> {
    // Validate Cloudinary URL
    if (!note.fileUrl.startsWith('https://res.cloudinary.com')) {
      throw new Error('Invalid Cloudinary URL');
    }
    const newNote = new NoteModel(note);
    return newNote.save();
  }

  async findById(id: string): Promise<INote | null> {
    return NoteModel.findById(id).lean();
  }

  async findAll(): Promise<INote[]> {
    return NoteModel.find().lean();
  }
}
