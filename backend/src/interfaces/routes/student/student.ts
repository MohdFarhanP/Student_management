import express, { Router } from 'express';
import { IStudentProfileController } from '../../controllers/student/IStudentProfileController';
import { IAttendanceController } from '../../controllers/teacher/IAttendanceController';
import { IClassController } from '../../controllers/admin/class/IClassController';
import { authenticateUser } from '../../middleware/authenticateUser';

const router: Router = express.Router();

let studentProfileController: IStudentProfileController | null = null;
let attendanceController: IAttendanceController | null = null;
let classController: IClassController | null = null;

export const setStudentControllers = (controllers: {
  studentProfileController: IStudentProfileController;
  attendanceController: IAttendanceController;
  classController: IClassController;
}) => {
  studentProfileController = controllers.studentProfileController;
  attendanceController = controllers.attendanceController;
  classController = controllers.classController;
};

router.get('/profile/:email', authenticateUser, (req, res, next) => {
  if (!studentProfileController) {
    throw new Error(
      'StudentProfileController not initialized. Dependency injection failed.'
    );
  }
  studentProfileController.getProfile.bind(studentProfileController)(
    req,
    res,
    next
  );
});

router.get('/info', authenticateUser, (req, res, next) => {
  if (!studentProfileController) {
    throw new Error(
      'StudentProfileController not initialized. Dependency injection failed.'
    );
  }
  studentProfileController.getBasicInfo.bind(studentProfileController)(
    req,
    res,
    next
  );
});

router.patch('/profile/image', authenticateUser, (req, res, next) => {
  if (!studentProfileController) {
    throw new Error(
      'StudentProfileController not initialized. Dependency injection failed.'
    );
  }
  studentProfileController.updateProfileImage.bind(studentProfileController)(
    req,
    res,
    next
  );
});

router.get('/attendance/:studentId', authenticateUser, (req, res, next) => {
  if (!attendanceController) {
    throw new Error(
      'AttendanceController not initialized. Dependency injection failed.'
    );
  }
  attendanceController.viewAttendance.bind(attendanceController)(
    req,
    res,
    next
  );
});

router.get('/my-class', authenticateUser, (req, res, next) => {
  if (!classController) {
    throw new Error(
      'ClassController not initialized. Dependency injection failed.'
    );
  }
  classController.getClassForStudent.bind(classController)(req, res, next);
});
router.get('/fees/due', authenticateUser, (req, res, next) => {
  if (!studentProfileController) {
    throw new Error(
      'ClassController not initialized. Dependency injection failed.'
    );
  }
  studentProfileController.getUnpaidDues.bind(studentProfileController)(
    req,
    res,
    next
  );
});
router.post('/fees/pay', authenticateUser, (req, res, next) => {
  if (!studentProfileController) {
    throw new Error(
      'ClassController not initialized. Dependency injection failed.'
    );
  }
  studentProfileController.processPayment.bind(studentProfileController)(
    req,
    res,
    next
  );
});

export default router;
