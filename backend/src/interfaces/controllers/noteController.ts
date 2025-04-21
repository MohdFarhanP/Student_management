import { Request, Response } from 'express';
import { UploadNoteImpl } from '../../application/useCases/teacher/uploadsNotesUseCase';
import { DownloadNoteImpl } from '../../application/useCases/student/downloadNotesUseCase';
import { ListNotesImpl } from '../../application/useCases/student/listNoteUseCase';
import { INote } from '../../domain/interface/INote';
import HttpStatus from '../../utils/httpStatus';
import axios from 'axios';
import cloudinary from '../../utils/cloudinary';

export class NoteController {
  constructor(
    private uploadNoteUseCase: UploadNoteImpl,
    private downloadNoteUseCase: DownloadNoteImpl,
    private listNotesUseCase: ListNotesImpl
  ) {}

  async uploadNote(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'Teacher') {
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
      if (!req.user || req.user.role !== 'Student') {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ error: 'Only students can download notes' });
        return;
      }

      const { noteId } = req.params;
      const note: INote | null = await this.downloadNoteUseCase.execute(noteId);
      if (!note) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: 'Note not found' });
        return;
      }

      console.log('Note to download:', note);

      // Try streaming the public URL first
      const fileUrl = note.fileUrl;
      console.log('Attempting public URL:', fileUrl);

      let response;
      try {
        response = await axios.get(fileUrl, {
          responseType: 'stream',
        });
        if (response.status !== 200) {
          throw new Error(`Public URL failed: ${response.statusText}`);
        }
      } catch (publicError: any) {
        if (publicError.response?.status === 401) {
          // Fallback to signed URL for authenticated files
          const urlParts = fileUrl.split('/');
          const fileName = urlParts.pop()?.split('.')[0];
          const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
          const publicId = versionIndex !== -1 ? urlParts.slice(versionIndex + 1).join('/') + '/' + fileName : fileName;
          if (!publicId) {
            throw new Error('Invalid Cloudinary URL');
          }

          const signedUrl = cloudinary.url(publicId, {
            resource_type: 'raw',
            secure: true,
            sign_url: true,
            type: 'authenticated',
          });
          console.log('Falling back to signed URL:', signedUrl);
          response = await axios.get(signedUrl, {
            responseType: 'stream',
          });
          if (response.status !== 200) {
            throw new Error(`Signed URL failed: ${response.statusText}`);
          }
        } else {
          throw publicError;
        }
      }

      console.log('Download response:', response.status, response.headers);

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${note.title}"`
      );
      res.setHeader(
        'Content-Type',
        response.headers['content-type'] || 'application/octet-stream'
      );

      response.data.pipe(res);
    } catch (error: any) {
      console.error('Download error:', error.message, error.response?.status);
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: error.message || 'Failed to download note' });
    }
  }

  async getAllNotes(req: Request, res: Response) {
    try {
      if (!req.user || !['Student', 'Teacher'].includes(req.user.role)) {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ error: 'Access restricted to Students and Teachers' });
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