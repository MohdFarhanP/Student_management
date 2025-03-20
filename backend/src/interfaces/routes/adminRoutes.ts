import express from 'express';
import athenticationRoutes from './athenticationRoutes.js';
import classRoutes from './classRoutes.js';
const router = express.Router();

router.use('/auth', athenticationRoutes);
router.use('/classes', classRoutes);

export default router;
