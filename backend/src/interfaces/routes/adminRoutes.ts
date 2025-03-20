import express from 'express';
import athenticationRoutes from './athenticationRoutes.js';
import classRoutes from './classRoutes.js';
import bulkUploadRoute from './bulkUploadRoutes.js';
const router = express.Router();

router.use('/auth', athenticationRoutes);
router.use('/classes', classRoutes);
router.use('/upload', bulkUploadRoute);
export default router;
