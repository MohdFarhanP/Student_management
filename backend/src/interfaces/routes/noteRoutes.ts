import express, { Router } from 'express';
import { DependencyContainer } from '../../infrastructure/di/container';
import { authenticateUser } from '../middleware/authenticateUser';

const router: Router = express.Router();
const container = DependencyContainer.getInstance();
const noteController = container.getNoteController();

router.post('/upload', authenticateUser, noteController.uploadNote.bind(noteController));
router.get('/download/:noteId', authenticateUser, noteController.downloadNote.bind(noteController));
router.get('/', authenticateUser, noteController.getAllNotes.bind(noteController));

export default router;