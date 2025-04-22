import express, { Router } from 'express';
import { DependencyContainer } from '../../../infrastructure/di/container';
import { authenticateUser } from '../../middleware/authenticateUser';

const router: Router = express.Router();
const container = DependencyContainer.getInstance();
const timetableController = container.getTimetableController();

router.put('/:classId/assign', authenticateUser, timetableController.assignTeacher.bind(timetableController));
router.put('/:classId/slot', authenticateUser, timetableController.updateTimetableSlot.bind(timetableController));
router.delete('/:classId/slot', authenticateUser, timetableController.deleteTimetableSlot.bind(timetableController));
router.get('/:classId', authenticateUser, timetableController.getTimetable.bind(timetableController));

export default router;