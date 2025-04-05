import { Router } from 'express';
import { TeacherController } from '../../controllers/teacher/teacherController.js';
import { TeacherProfileRepository } from '../../../infrastructure/repositories/teacher/TeacherProfileRepository.js';
import { GetTeacherProfileUseCase } from '../../../application/useCases/teacher/getTeacherProfileUseCase.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';
import { UpdateTeacherProfileUseCase } from '../../../application/useCases/teacher/updateTeacherProfileUseCase.js';

const router = Router();
const teacherRepository = new TeacherProfileRepository();
const getTeacherProfileUseCase = new GetTeacherProfileUseCase(
  teacherRepository
);
const updateTeacherProfileUseCase = new UpdateTeacherProfileUseCase(
  teacherRepository
);
const teacherController = new TeacherController(
  getTeacherProfileUseCase,
  updateTeacherProfileUseCase
);

router.get(
  '/profile',
  authenticateUser,
  teacherController.getProfile.bind(teacherController)
);
router.patch(
  '/profile',
  authenticateUser,
  teacherController.updateProfile.bind(teacherController)
);

export default router;
