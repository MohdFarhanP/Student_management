import express from 'express';
import { DependencyContainer } from '../../../infrastructure/di/container';
import { authenticateUser } from '../../middleware/authenticateUser';

const router = express.Router();
const container = DependencyContainer.getInstance();
const teacherController = container.getTeacherController();

router.get('/teachers', authenticateUser, teacherController.getTeachers.bind(teacherController));
router.get('/all', authenticateUser, teacherController.getAllTeachers.bind(teacherController));
router.post('/teacher', authenticateUser, teacherController.addTeacher.bind(teacherController));
router.put('/:teacherId', authenticateUser, teacherController.editTeacher.bind(teacherController));
router.delete('/:teacherId', authenticateUser, teacherController.deleteTeacher.bind(teacherController));

export default router;