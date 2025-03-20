import express from 'express';
import { AdminController } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', AdminController.login);
router.post('/logout', AdminController.logout);

export default router;
