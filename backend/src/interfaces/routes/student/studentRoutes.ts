import { Router } from 'express';
import { StudentController } from '../../controllers/student/studentController.js';
import { StudentProfileRepository } from '../../../infrastructure/repositories/student/StudentProfileRepository.js';
import { GetStudentProfileUseCase } from '../../../application/useCases/student/GetStudentProfileUseCase.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';

const router = Router();

const studentRepository = new StudentProfileRepository();
const getStudentProfileUseCase = new GetStudentProfileUseCase(
  studentRepository
);
const studentController = new StudentController(getStudentProfileUseCase);

router.get(
  '/profile',
  authenticateUser,
  studentController.getProfile.bind(studentController)
);

export default router;
