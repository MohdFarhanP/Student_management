import { Router } from 'express';
import { TeacherController } from '../../controllers/teacher/teacherController.js';
import { TeacherProfileRepository } from '../../../infrastructure/repositories/teacher/TeacherProfileRepository.js';
import { GetTeacherProfileUseCase } from '../../../application/useCases/teacher/getTeacherProfileUseCase.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';
import { UpdateTeacherProfileUseCase } from '../../../application/useCases/teacher/updateTeacherProfileUseCase.js';
import { AttendanceController } from '../../controllers/teacher/attendanceControllers.js';

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
const attendanceController = new AttendanceController();

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

router.post(
  '/classes/:classId/attendance',
  attendanceController.markAttendance.bind(attendanceController)
);

export default router;
