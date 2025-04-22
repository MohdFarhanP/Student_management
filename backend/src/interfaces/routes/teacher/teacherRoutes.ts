import express, { Router } from 'express';
import { DependencyContainer } from '../../../infrastructure/di/container';
import { authenticateUser } from '../../middleware/authenticateUser';

const router: Router = express.Router();
const container = DependencyContainer.getInstance();
const teacherProfileController = container.getTeacherProfileController();
const attendanceController = container.getAttendanceController();

router.get(
  '/profile',
  authenticateUser,
  teacherProfileController.getProfile.bind(teacherProfileController)
);
router.patch(
  '/profile',
  authenticateUser,
  teacherProfileController.updateProfile.bind(teacherProfileController)
);
router.post(
  '/attendance/:classId/mark',
  authenticateUser,
  attendanceController.markAttendance.bind(attendanceController)
);

export default router;