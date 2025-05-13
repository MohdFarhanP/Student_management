import { INoteRepository } from '../../domain/interface/INotRepository';
import { NoteModel } from '../database/models/notesModel';
import { Note } from '../../domain/entities/note';


export class NoteRepository implements INoteRepository {
  async save(note: Note): Promise<Note> {
    const newNote = new NoteModel({
      title: note.title,
      fileUrl: note.fileUrl,
      fileHash: note.fileHash,
      uploadedBy: note.uploadedBy,
      createdAt: note.createdAt,
    });
    const savedNote = await newNote.save();
    return Note.create({
      id: savedNote._id.toString(),
      title: savedNote.title,
      fileUrl: savedNote.fileUrl,
      fileHash: savedNote.fileHash,
      uploadedBy: savedNote.uploadedBy,
      createdAt: savedNote.createdAt,
    });
  }
  
  async findByHash(fileHash: string): Promise<Note | null> {
    const note = await NoteModel.findOne({ fileHash });
    if (!note) return null;
    return Note.create({
      id: note._id.toString(),
      title: note.title,
      fileUrl: note.fileUrl,
      fileHash: note.fileHash,
      uploadedBy: note.uploadedBy,
      createdAt: note.createdAt,
    });
  }

  async findById(id: string): Promise<Note | null> {
    const doc = await NoteModel.findById(id).lean();
    if (!doc) return null;
    return Note.create({
      id: doc._id.toString(),
      title: doc.title,
      fileUrl: doc.fileUrl,
      fileHash: doc.fileHash,
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
        fileHash: doc.fileHash,
        uploadedBy: doc.uploadedBy,
        createdAt: doc.createdAt,
      })
    );
  }
  
   async findByUploadedBy(uploadedBy: string): Promise<Note[]> {
    const docs = await NoteModel.find({ uploadedBy }).lean();
    return docs.map((doc) =>
      Note.create({
        id: doc._id.toString(),
        title: doc.title,
        fileUrl: doc.fileUrl,
        fileHash: doc.fileHash,
        uploadedBy: doc.uploadedBy,
        createdAt: doc.createdAt,
      })
    );
  }
}