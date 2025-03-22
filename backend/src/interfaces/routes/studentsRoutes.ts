import express from 'express';
import { StudentController } from '../controllers/studentsController.js';
import { GetAllStudentsUseCase } from '../../application/useCases/student/betAllStudentsUseCase.js';
import { StudentRepository } from '../../infrastructure/repositories/studentRepository.js';

const router = express.Router();
const studentRepository = new StudentRepository();
const getAllStudentsUseCase = new GetAllStudentsUseCase(studentRepository);
const studentController = new StudentController(getAllStudentsUseCase);

router.get('/allStudents', (req, res) =>
  studentController.getStudents(req, res)
);

export default router;
