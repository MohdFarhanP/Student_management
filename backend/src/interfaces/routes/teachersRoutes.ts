import express from 'express';
import { GetAllTeachersUseCase } from '../../application/useCases/teacher/getAllTeachersUseCase.js';
import { TeacherController } from '../controllers/teachersController.js';
import { GetTeachersByLimitUseCase } from '../../application/useCases/teacher/getTeachersByLimitUseCase.js';
import { TeacherRepository } from '../../infrastructure/repositories/teacherRepository.js';

const router = express.Router();
const teacherRepository = new TeacherRepository();
const getTeachersByLimitUseCase = new GetTeachersByLimitUseCase(
  teacherRepository
);
const getAllTeachersUseCase = new GetAllTeachersUseCase(teacherRepository); // Fix: Use GetAllTeachers
const teacherController = new TeacherController(
  getTeachersByLimitUseCase,
  getAllTeachersUseCase
);

router.get('/teachers', (req, res) => teacherController.getTeachers(req, res));
router.get('/allTeachers', (req, res) =>
  teacherController.getAllTeachers(req, res)
);

export default router;
