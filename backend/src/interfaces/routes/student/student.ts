import express, { Router } from 'express';
import { DependencyContainer } from '../../../infrastructure/di/container';
import { authenticateUser } from '../../middleware/authenticateUser';

const router: Router = express.Router();
const container = DependencyContainer.getInstance();
const studentProfileController = container.getStudentProfileController();
const attendanceController = container.getAttendanceController();
const classController = container.getClassController();

router.get(
  '/profile/:email',
  authenticateUser,
  studentProfileController.getProfile.bind(studentProfileController)
);
router.patch(
  '/profile/image',
  authenticateUser,
  studentProfileController.updateProfileImage.bind(studentProfileController)
);

router.get(
  '/attendance/:studentId',
  authenticateUser,
  attendanceController.viewAttendance.bind(attendanceController)
);
router.get('/my-class', authenticateUser, classController.getClassForStudent.bind(classController));


export default router;