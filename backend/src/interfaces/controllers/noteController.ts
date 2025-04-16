import { Request, Response } from 'express';
import { UploadNoteImpl } from '../../application/useCases/teacher/uploadsNotesUseCase.js';
import { DownloadNoteImpl } from '../../application/useCases/student/downloadNotesUseCase.js';
import { ListNotesImpl } from '../../application/useCases/student/listNoteUseCase.js';
import { INote } from '../../domain/interface/INote.js';
import HttpStatus from '../../utils/httpStatus.js';

export class NoteController {
  constructor(
    private uploadNoteUseCase: UploadNoteImpl,
    private downloadNoteUseCase: DownloadNoteImpl,
    private listNotesUseCase: ListNotesImpl
  ) {}

  async uploadNote(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'teacher') {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ error: 'Only teachers can upload notes' });
        return;
      }

      const { title, fileUrl } = req.body;
      if (!title || !fileUrl) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'Title and fileUrl are required' });
        return;
      }

      const uploadedBy = req.user.id;
      const note: INote = await this.uploadNoteUseCase.execute(
        title,
        fileUrl,
        uploadedBy
      );
      res.status(HttpStatus.CREATED).json({
        _id: note._id,
        title: note.title,
        fileUrl: note.fileUrl,
        uploadedBy: note.uploadedBy,
        createdAt: note.createdAt,
      });
    } catch (error: any) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || 'Failed to upload note' });
    }
  }

  async downloadNote(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'student') {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ error: 'Only students can download notes' });
        return;
      }

      const { noteId } = req.params;
      const note: INote = await this.downloadNoteUseCase.execute(noteId);
      res.status(HttpStatus.OK).json({ fileUrl: note.fileUrl });
    } catch (error: any) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: error.message || 'Note not found' });
    }
  }

  async getAllNotes(req: Request, res: Response) {
    try {
      if (!req.user || !['student', 'teacher'].includes(req.user.role)) {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ error: 'Access restricted to students and teachers' });
        return;
      }

      const notes: INote[] = await this.listNotesUseCase.execute();
      res.status(HttpStatus.OK).json(
        notes.map((note) => ({
          _id: note._id,
          title: note.title,
          fileUrl: note.fileUrl,
          uploadedBy: note.uploadedBy,
          createdAt: note.createdAt,
        }))
      );
    } catch (error: any) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || 'Failed to fetch notes' });
    }
  }
}
