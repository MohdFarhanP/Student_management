import express from 'express';
import { StudentController } from '../../controllers/admin/studentsController.js';
import { GetAllStudentsUseCase } from '../../../application/useCases/admin/student/getAllStudentsUseCase.js';
import { StudentRepository } from '../../../infrastructure/repositories/admin/studentRepository.js';
import { AddStudentUseCase } from '../../../application/useCases/admin/student/addStudentUseCase.js';
import { EditStudentUseCase } from '../../../application/useCases/admin/student/editStudentUseCase.js';
import { DeleteStudentUseCase } from '../../../application/useCases/admin/student/deleteStudentUseCase.js';
import { GetStudentProfileUseCase } from '../../../application/useCases/student/GetStudentProfileUseCase.js';
import { AuthService } from '../../../application/services/authService.js';
import { StudentProfileRepository } from '../../../infrastructure/repositories/student/StudentProfileRepository.js';
import { GetStudentsByClassUseCase } from '../../../application/useCases/admin/student/getStudentsByClass.js';

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
const getStudentsByClassUseCase = new GetStudentsByClassUseCase(
  studentRepository
);
const studentController = new StudentController(
  getAllStudentsUseCase,
  addStudentUseCase,
  editStudentUseCase,
  deleteStudentUseCase,
  getStudentProfileUseCase,
  getStudentsByClassUseCase
);

router.get('/students', studentController.getStudents.bind(studentController));
router.post('/student', studentController.addStudent.bind(studentController));
router.put(
  '/studentById/:studentId',
  studentController.editStudent.bind(studentController)
);
router.delete(
  '/studentById/:studentId',
  studentController.deleteStudent.bind(studentController)
);
router.get(
  '/profile/:email',
  studentController.getProfile.bind(studentController)
);
export default router;
