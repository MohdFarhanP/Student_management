import express, { Router } from 'express';
import { ITeacherProfileController } from '../../../domain/interface/ITeacherProfileController';
import { IAttendanceController } from '../../../domain/interface/teacher/IAttendanceController';
import { IClassController } from '../../../domain/interface/IClassController';
import { authenticateUser } from '../../middleware/authenticateUser';

const router: Router = express.Router();

let teacherProfileController: ITeacherProfileController | null = null;
let attendanceController: IAttendanceController | null = null;
let classController: IClassController | null = null;

export const setTeacherControllers = (controllers: {
  teacherProfileController: ITeacherProfileController;
  attendanceController: IAttendanceController;
  classController: IClassController;
}) => {
  teacherProfileController = controllers.teacherProfileController;
  attendanceController = controllers.attendanceController;
  classController = controllers.classController;
};

router.get('/profile', authenticateUser, (req, res, next) => {
  if (!teacherProfileController) {
    throw new Error('TeacherProfileController not initialized. Dependency injection failed.');
  }
  teacherProfileController.getProfile.bind(teacherProfileController)(req, res, next);
});

router.patch('/profile', authenticateUser, (req, res, next) => {
  if (!teacherProfileController) {
    throw new Error('TeacherProfileController not initialized. Dependency injection failed.');
  }
  teacherProfileController.updateProfile.bind(teacherProfileController)(req, res, next);
});

router.post('/attendance/:classId/mark', authenticateUser, (req, res, next) => {
  if (!attendanceController) {
    throw new Error('AttendanceController not initialized. Dependency injection failed.');
  }
  attendanceController.markAttendance.bind(attendanceController)(req, res, next);
});

router.get('/classes', authenticateUser, (req, res, next) => {
  if (!classController) {
    throw new Error('ClassController not initialized. Dependency injection failed.');
  }
  classController.getClassesForTeacher.bind(classController)(req, res, next);
});

export default router;