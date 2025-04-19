import { Router } from 'express';
import { StudentController } from '../../controllers/student/studentController';
import { StudentProfileRepository } from '../../../infrastructure/repositories/student/StudentProfileRepository';
import { GetStudentProfileUseCase } from '../../../application/useCases/student/GetStudentProfileUseCase';
import { UpdateStudentProfileImageUseCase } from '../../../application/useCases/student/UpdateStudentProfileImageUseCase';
import { authenticateUser } from '../../middleware/authenticateUser';
import { AttendanceController } from '../../controllers/teacher/attendanceControllers';

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
const controller = new AttendanceController();

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
router.get(
  '/attendance/:studentId',
  controller.viewAttendance.bind(controller)
);
export default router;
