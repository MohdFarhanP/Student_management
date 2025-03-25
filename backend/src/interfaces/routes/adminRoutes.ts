import express from 'express';
import athenticationRoutes from './athenticationRoutes.js';
import classRoutes from './classRoutes.js';
import bulkUploadRoute from './bulkUploadRoutes.js';
import studentsRoute from './studentsRoutes.js';
import teacherRoute from './teachersRoutes.js';
import timeTableRoutes from './timeTableRoutes.js';

const router = express.Router();

router.use('/auth', athenticationRoutes);
router.use('/classes', classRoutes);
router.use('/upload', bulkUploadRoute);
router.use('/student', studentsRoute);
router.use('/teacher', teacherRoute);
router.use('/timetable', timeTableRoutes);

export default router;
