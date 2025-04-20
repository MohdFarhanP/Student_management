import { Request, Response } from 'express';
   import { UploadNoteImpl } from '../../application/useCases/teacher/uploadsNotesUseCase';
   import { DownloadNoteImpl } from '../../application/useCases/student/downloadNotesUseCase';
   import { ListNotesImpl } from '../../application/useCases/student/listNoteUseCase';
   import { INote } from '../../domain/interface/INote';
   import HttpStatus from '../../utils/httpStatus';
   import cloudinary from '../../utils/cloudinary';
   import { Readable } from 'stream';

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
         const note: INote = await this.downloadNoteUseCase.execute(noteId);

         console.log('Note to download:', note);

         // Extract public_id
         const publicId = note.fileUrl.split('/').pop()?.split('.')[0];
         if (!publicId) {
           throw new Error('Invalid Cloudinary URL');
         }

         // Stream file from Cloudinary
         const fileStream = await new Promise<Readable>((resolve, reject) => {
           const stream = cloudinary.uploader.download_stream(
             publicId,
             { resource_type: 'raw' },
             (error) => {
               if (error) reject(error);
             }
           );
           resolve(stream);
         });

         res.setHeader(
           'Content-Disposition',
           `attachment; filename="${note.title}"`
         );
         res.setHeader('Content-Type', 'application/octet-stream');
         fileStream.pipe(res);
       } catch (error: any) {
         console.error('Download error:', error.message, error.response?.status);
         res
           .status(HttpStatus.NOT_FOUND)
           .json({ error: error.message || 'Note not found' });
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