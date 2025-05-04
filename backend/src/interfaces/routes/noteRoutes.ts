import { Router } from 'express';
import { INoteController } from '../../domain/interface/INoteController';
import { authenticateUser } from '../middleware/authenticateUser';

const router: Router = Router();

let noteController: INoteController | null = null;

export const setNoteController = (controller: INoteController) => {
  noteController = controller;
};

router.post('/upload', authenticateUser, (req, res, next) => {
  if (!noteController) {
    throw new Error('NoteController not initialized. Dependency injection failed.');
  }
  noteController.uploadNote.bind(noteController)(req, res, next);
});

router.get('/download/:noteId', authenticateUser, (req, res, next) => {
  if (!noteController) {
    throw new Error('NoteController not initialized. Dependency injection failed.');
  }
  noteController.downloadNote.bind(noteController)(req, res, next);
});

router.get('/', authenticateUser, (req, res, next) => {
  if (!noteController) {
    throw new Error('NoteController not initialized. Dependency injection failed.');
  }
  noteController.getAllNotes.bind(noteController)(req, res, next);
});

export default router;