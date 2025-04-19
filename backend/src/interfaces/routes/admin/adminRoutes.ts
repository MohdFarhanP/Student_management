import express from 'express';
import classRoutes from './classRoutes';
import bulkUploadRoute from './bulkUploadRoutes';
import studentsRoute from './studentsRoutes';
import teacherRoute from './teachersRoutes';
import timeTableRoutes from './timeTableRoutes';

const router = express.Router();

//Admin moudule routes
router.use('/classes', classRoutes);
router.use('/upload', bulkUploadRoute);
router.use('/students', studentsRoute);
router.use('/teacher', teacherRoute);
router.use('/timetable', timeTableRoutes);

export default router;
