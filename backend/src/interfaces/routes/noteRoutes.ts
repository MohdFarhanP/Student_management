import express from 'express';
import { NoteController } from '../controllers/noteController.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { NoteRepositoryImpl } from '../../infrastructure/repositories/notesRepository.js';
import { UploadNoteImpl } from '../../application/useCases/teacher/uploadsNotesUseCase.js';
import { DownloadNoteImpl } from '../../application/useCases/student/downloadNotesUseCase.js';
import { ListNotesImpl } from '../../application/useCases/student/listNoteUseCase.js';

const router = express.Router();

const noteRepository = new NoteRepositoryImpl();
const uploadNoteUseCase = new UploadNoteImpl(noteRepository);
const downloadNoteUseCase = new DownloadNoteImpl(noteRepository);
const listNotesUseCase = new ListNotesImpl(noteRepository);
const controller = new NoteController(
  uploadNoteUseCase,
  downloadNoteUseCase,
  listNotesUseCase
);

router.post(
  '/upload',
  authenticateUser,
  controller.uploadNote.bind(controller)
);
router.get(
  '/download/:noteId',
  authenticateUser,
  controller.downloadNote.bind(controller)
);
router.get('/', authenticateUser, controller.getAllNotes.bind(controller));

export default router;
