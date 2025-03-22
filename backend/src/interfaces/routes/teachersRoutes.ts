import express from 'express';
import { TeacherController } from '../controllers/teachersController.js';
import { GetAllTeachersUseCase } from '../../application/useCases/teacher/getAllTeachersUseCase.js';
import { TeacherRepository } from '../../infrastructure/repositories/teacherRepository.js';

const router = express.Router();
const teacherRepository = new TeacherRepository();
const getAllTeachersUseCase = new GetAllTeachersUseCase(teacherRepository);
const teacherController = new TeacherController(getAllTeachersUseCase);

router.get('/allTeachers', (req, res) =>
  teacherController.getTeachers(req, res)
);

export default router;
