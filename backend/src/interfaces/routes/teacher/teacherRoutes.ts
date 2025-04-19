import { Router } from 'express';
import { TeacherController } from '../../controllers/teacher/teacherController';
import { TeacherProfileRepository } from '../../../infrastructure/repositories/teacher/TeacherProfileRepository';
import { GetTeacherProfileUseCase } from '../../../application/useCases/teacher/getTeacherProfileUseCase';
import { authenticateUser } from '../../middleware/authenticateUser';
import { UpdateTeacherProfileUseCase } from '../../../application/useCases/teacher/updateTeacherProfileUseCase';
import { AttendanceController } from '../../controllers/teacher/attendanceControllers';

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
  '/attendance/:classId/mark',
  authenticateUser,
  attendanceController.markAttendance.bind(attendanceController)
);

export default router;
