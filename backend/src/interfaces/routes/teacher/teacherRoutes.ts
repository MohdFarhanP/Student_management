import { Router } from 'express';
import { TeacherController } from '../../controllers/teacher/teacherController.js';
import { TeacherProfileRepository } from '../../../infrastructure/repositories/teacher/TeacherProfileRepository.js';
import { GetTeacherProfileUseCase } from '../../../application/useCases/teacher/getTeacherProfileUseCase.js';

const router = Router();
const teacherRepository = new TeacherProfileRepository();
const getTeacherProfileUseCase = new GetTeacherProfileUseCase(
  teacherRepository
);
const teacherController = new TeacherController(getTeacherProfileUseCase);

router.get('/profile', (req, res) => teacherController.getProfile(req, res));

export default router;
