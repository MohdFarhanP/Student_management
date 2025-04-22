import express from 'express';
import { DependencyContainer } from '../../../infrastructure/di/container';
import { authenticateUser } from '../../middleware/authenticateUser';

const router = express.Router();
const container = DependencyContainer.getInstance();
const teacherController = container.getTeacherController();

router.get('/teachers', authenticateUser, teacherController.getTeachers.bind(teacherController));
router.get('/teachers/all', authenticateUser, teacherController.getAllTeachers.bind(teacherController));
router.post('/teacher', authenticateUser, teacherController.addTeacher.bind(teacherController));
router.put('/teacher/:teacherId', authenticateUser, teacherController.editTeacher.bind(teacherController));
router.delete('/teacher/:teacherId', authenticateUser, teacherController.deleteTeacher.bind(teacherController));

export default router;