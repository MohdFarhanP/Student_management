import express from 'express';
import { DependencyContainer } from '../../../infrastructure/di/container';
import { authenticateUser } from '../../middleware/authenticateUser';

const router = express.Router();
const container = DependencyContainer.getInstance();
const studentController = container.getStudentController();

router.get('/students', authenticateUser, studentController.getStudents.bind(studentController));
router.post('/student', authenticateUser, studentController.addStudent.bind(studentController));
router.put('/student/:studentId', authenticateUser, studentController.editStudent.bind(studentController));
router.delete('/student/:studentId', authenticateUser, studentController.deleteStudent.bind(studentController));
router.get('/profile/:email', authenticateUser, studentController.getProfile.bind(studentController));

export default router;