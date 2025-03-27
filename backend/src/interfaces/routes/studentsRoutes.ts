import express from 'express';
import { StudentController } from '../controllers/studentsController.js';
import { GetAllStudentsUseCase } from '../../application/useCases/student/getAllStudentsUseCase.js';
import { StudentRepository } from '../../infrastructure/repositories/studentRepository.js';
import { AddStudentUseCase } from '../../application/useCases/student/addStudentUseCase.js';
import { EditStudentUseCase } from '../../application/useCases/student/editStudentUseCase.js';
import { DeleteStudentUseCase } from '../../application/useCases/student/deleteStudentUseCase.js';

const router = express.Router();
const studentRepository = new StudentRepository();
const getAllStudentsUseCase = new GetAllStudentsUseCase(studentRepository);
const addStudentUseCase = new AddStudentUseCase(studentRepository);
const editStudentUseCase = new EditStudentUseCase(studentRepository);
const deleteStudentUseCase = new DeleteStudentUseCase(studentRepository);
const studentController = new StudentController(
  getAllStudentsUseCase,
  addStudentUseCase,
  editStudentUseCase,
  deleteStudentUseCase
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
export default router;
