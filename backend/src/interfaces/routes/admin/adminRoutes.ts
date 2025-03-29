import express from 'express';
import classRoutes from './classRoutes.js';
import bulkUploadRoute from './bulkUploadRoutes.js';
import studentsRoute from './studentsRoutes.js';
import teacherRoute from './teachersRoutes.js';
import timeTableRoutes from './timeTableRoutes.js';

const router = express.Router();

//Admin moudule routes
router.use('/classes', classRoutes);
router.use('/upload', bulkUploadRoute);
router.use('/students', studentsRoute);
router.use('/teacher', teacherRoute);
router.use('/timetable', timeTableRoutes);

export default router;
