import { INoteRepository } from '../../domain/interface/INotRepository';
import { NoteModel } from '../database/models/notesModel';
import { Note } from '../../domain/entities/note';


export class NoteRepository implements INoteRepository {
  async save(note: Note): Promise<Note> {
    const newNote = new NoteModel({
      title: note.title,
      fileUrl: note.fileUrl,
      uploadedBy: note.uploadedBy,
      createdAt: note.createdAt,
    });
    const savedNote = await newNote.save();
    return Note.create({
      id: savedNote._id.toString(),
      title: savedNote.title,
      fileUrl: savedNote.fileUrl,
      uploadedBy: savedNote.uploadedBy,
      createdAt: savedNote.createdAt,
    });
  }

  async findById(id: string): Promise<Note | null> {
    const doc = await NoteModel.findById(id).lean();
    if (!doc) return null;
    return Note.create({
      id: doc._id.toString(),
      title: doc.title,
      fileUrl: doc.fileUrl,
      uploadedBy: doc.uploadedBy,
      createdAt: doc.createdAt,
    });
  }

  async findAll(): Promise<Note[]> {
    const docs = await NoteModel.find().lean();
    return docs.map((doc) =>
      Note.create({
        id: doc._id.toString(),
        title: doc.title,
        fileUrl: doc.fileUrl,
        uploadedBy: doc.uploadedBy,
        createdAt: doc.createdAt,
      })
    );
  }
}