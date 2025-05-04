import express from 'express';
import classRoutes, { setClassControllers } from './classRoutes';
import bulkUploadRoute, { setBulkUploadController } from './bulkUploadRoutes';
import studentsRoute, { setStudentController } from './studentsRoutes';
import teacherRoute, { setTeacherController } from './teachersRoutes';
import timeTableRoutes, { setTimetableController } from './timeTableRoutes';
import { IClassController } from '../../../domain/interface/IClassController';
import { ISubjectController } from '../../../domain/interface/ISubjectController';
import { IBulkUploadController } from '../../../domain/interface/IBulkUploadController';
import { IStudentController } from '../../../domain/interface/IStudentController';
import { ITeacherController } from '../../../domain/interface/ITeacherController';
import { ITimetableController } from '../../../domain/interface/ITimetableController';

const router = express.Router();

export const setAdminControllers = (controllers: {
  classController: IClassController;
  subjectController: ISubjectController;
  bulkUploadController: IBulkUploadController;
  studentController: IStudentController;
  teacherController: ITeacherController;
  timetableController: ITimetableController;
}) => {
  setClassControllers({
    classController: controllers.classController,
    subjectController: controllers.subjectController,
  });
  setBulkUploadController(controllers.bulkUploadController);
  setStudentController(controllers.studentController);
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