import express from 'express';
import { StudentController } from '../../controllers/admin/studentsController';
import { GetAllStudentsUseCase } from '../../../application/useCases/admin/student/getAllStudentsUseCase';
import { StudentRepository } from '../../../infrastructure/repositories/admin/studentRepository';
import { AddStudentUseCase } from '../../../application/useCases/admin/student/addStudentUseCase';
import { EditStudentUseCase } from '../../../application/useCases/admin/student/editStudentUseCase';
import { DeleteStudentUseCase } from '../../../application/useCases/admin/student/deleteStudentUseCase';
import { GetStudentProfileUseCase } from '../../../application/useCases/student/GetStudentProfileUseCase';
import { AuthService } from '../../../application/services/authService';
import { StudentProfileRepository } from '../../../infrastructure/repositories/student/StudentProfileRepository';
import { authenticateUser } from '../../middleware/authenticateUser';

const router = express.Router();
const studentRepository = new StudentRepository();
const studentProfileRepository = new StudentProfileRepository();
const authService = new AuthService();
const getAllStudentsUseCase = new GetAllStudentsUseCase(studentRepository);
const addStudentUseCase = new AddStudentUseCase(studentRepository, authService);
const editStudentUseCase = new EditStudentUseCase(studentRepository);
const deleteStudentUseCase = new DeleteStudentUseCase(studentRepository);
const getStudentProfileUseCase = new GetStudentProfileUseCase(
  studentProfileRepository
);

const studentController = new StudentController(
  getAllStudentsUseCase,
  addStudentUseCase,
  editStudentUseCase,
  deleteStudentUseCase,
  getStudentProfileUseCase
);

router.get('/students', authenticateUser, studentController.getStudents.bind(studentController));
router.post('/student', authenticateUser, studentController.addStudent.bind(studentController));
router.put(
  '/studentById/:studentId',
  authenticateUser,
  studentController.editStudent.bind(studentController)
);
router.delete(
  '/studentById/:studentId',
  authenticateUser,
  studentController.deleteStudent.bind(studentController)
);
router.get(
  '/profile/:email',
  authenticateUser,
  studentController.getProfile.bind(studentController)
);
export default router;
