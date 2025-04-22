import { Request, Response } from 'express';
import { IUploadNoteUseCase } from '../../domain/interface/IUploadNoteUseCase';
import { IDownloadNoteUseCase } from '../../domain/interface/IDownloadNoteUseCase';
import { IListNotesUseCase } from '../../domain/interface/IListNotesUseCase'; 
import { INoteController } from '../../domain/interface/INoteController';
import { IApiResponse, IUser } from '../../domain/types/interfaces';
import HttpStatus from '../../utils/httpStatus';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../domain/errors/index';
import { Role } from '../../domain/types/enums';
import { ICloudinaryService } from '../../domain/interface/ICloudinaryService';
import { Note } from '../../domain/entities/note';

export class NoteController implements INoteController {
  constructor(
    private uploadNoteUseCase: IUploadNoteUseCase,
    private downloadNoteUseCase: IDownloadNoteUseCase,
    private listNotesUseCase: IListNotesUseCase,
    private cloudinaryService: ICloudinaryService
  ) {}

  async uploadNote(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser | undefined;
      if (!user?.id || user.role !== Role.Teacher) {
        throw new ForbiddenError('Only teachers can upload notes');
      }

      const { title, fileUrl } = req.body;
      if (!title || !fileUrl) {
        throw new BadRequestError('Title and fileUrl are required');
      }

      const note = await this.uploadNoteUseCase.execute(title, fileUrl, user.id);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Note uploaded successfully',
        data: {
          id: note.id,
          title: note.title,
          fileUrl: note.fileUrl,
          uploadedBy: note.uploadedBy,
          createdAt: note.createdAt,
        },
      } as IApiResponse<Partial<Note>>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload note';
      const status =
        error instanceof BadRequestError || error instanceof ForbiddenError
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ success: false, message } as IApiResponse<never>);
    }
  }

  async downloadNote(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser | undefined;
      if (!user?.id || user.role !== Role.Student) {
        throw new ForbiddenError('Only students can download notes');
      }

      const { noteId } = req.params;
      const note = await this.downloadNoteUseCase.execute(noteId);
      const { stream, contentType } = await this.cloudinaryService.getFileStream(note.fileUrl);

      res.setHeader('Content-Disposition', `attachment; filename="${note.title}"`);
      res.setHeader('Content-Type', contentType);
      stream.pipe(res);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download note';
      const status =
        error instanceof BadRequestError || error instanceof ForbiddenError
          ? HttpStatus.BAD_REQUEST
          : error instanceof NotFoundError
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ success: false, message } as IApiResponse<never>);
    }
  }

  async getAllNotes(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser | undefined;
      if (!user?.id || ![Role.Student, Role.Teacher].includes(user.role as Role)) {
        throw new ForbiddenError('Access restricted to students and teachers');
      }

      const notes = await this.listNotesUseCase.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Notes fetched successfully',
        data: notes.map((note) => ({
          id: note.id,
          title: note.title,
          fileUrl: note.fileUrl,
          uploadedBy: note.uploadedBy,
          createdAt: note.createdAt,
        })),
      } as IApiResponse<Partial<Note>[]>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch notes';
      const status =
        error instanceof BadRequestError || error instanceof ForbiddenError
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ success: false, message } as IApiResponse<never>);
    }
  }
}