import express from 'express';
import classRoutes, { setClassControllers } from './classRoutes';
import bulkUploadRoute, { setBulkUploadController } from './bulkUploadRoutes';
import studentsRoute, { setStudentController } from './studentsRoutes';
import teacherRoute, { setTeacherController } from './teachersRoutes';
import timeTableRoutes, { setTimetableController } from './timeTableRoutes';
import { IClassController } from '../../controllers/admin/class/IClassController';
import { ISubjectController } from '../../controllers/admin/subject/ISubjectController';
import { IBulkUploadController } from '../../controllers/admin/bulkUpload/IBulkUploadController';
import { IStudentController } from '../../controllers/admin/student/IStudentController';
import { ITeacherController } from '../../controllers/admin/teacher/ITeacherController';
import { ITimetableController } from '../../controllers/admin/timetable/ITimetableController';
import { IRecurringFeeController } from '../../controllers/admin/fees/IRecurringFeeController';
import { IPaymentController } from '../../controllers/admin/payment/IPaymentController';

const router = express.Router();

export const setAdminControllers = (controllers: {
  classController: IClassController;
  subjectController: ISubjectController;
  bulkUploadController: IBulkUploadController;
  studentController: IStudentController;
  teacherController: ITeacherController;
  timetableController: ITimetableController;
  recurringFeeController: IRecurringFeeController;
  paymentController: IPaymentController;
}) => {
  setClassControllers({
    classController: controllers.classController,
    subjectController: controllers.subjectController,
  });
  setStudentController({
    studentController: controllers.studentController,
    recurringFeeController: controllers.recurringFeeController,
    paymentController: controllers.paymentController,
  });
  setBulkUploadController(controllers.bulkUploadController);
  setTeacherController(controllers.teacherController);
  setTimetableController(controllers.timetableController);
};

// Admin module routes
router.use('/classes', classRoutes);
router.use('/upload', bulkUploadRoute);
router.use('/students', studentsRoute);
router.use('/teacher', teacherRoute);
router.use('/timetable', timeTableRoutes);

export default router;
