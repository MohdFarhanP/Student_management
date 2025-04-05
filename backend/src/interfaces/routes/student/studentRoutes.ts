import { Router } from 'express';
import { StudentController } from '../../controllers/student/studentController.js';
import { StudentProfileRepository } from '../../../infrastructure/repositories/student/StudentProfileRepository.js';
import { GetStudentProfileUseCase } from '../../../application/useCases/student/GetStudentProfileUseCase.js';
import { UpdateStudentProfileImageUseCase } from '../../../application/useCases/student/UpdateStudentProfileImageUseCase.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';

const router = Router();

const studentRepository = new StudentProfileRepository();
const getStudentProfileUseCase = new GetStudentProfileUseCase(
  studentRepository
);
const updateStudentProfileImageUseCase = new UpdateStudentProfileImageUseCase(
  studentRepository
);
const studentController = new StudentController(
  getStudentProfileUseCase,
  updateStudentProfileImageUseCase
);

router.get(
  '/profile/:email',
  authenticateUser,
  studentController.getProfile.bind(studentController)
);
router.patch(
  '/profile/image',
  authenticateUser,
  studentController.updateProfileImage.bind(studentController)
);

export default router;
