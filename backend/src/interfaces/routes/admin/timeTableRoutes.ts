import express, { Router } from 'express';
import TimetableController from '../../controllers/admin/timeTableController';
import TimetableRepository from '../../../infrastructure/repositories/admin/timeTableRepository';
import { TeacherRepository } from '../../../infrastructure/repositories/admin/teacherRepository';
import ManageTimetable from '../../../application/useCases/admin/timeTable/timetableUseCase';
import { authenticateUser } from '../../middleware/authenticateUser';

const router: Router = express.Router();
const timetableRepo = new TimetableRepository();
const teacherRepo = new TeacherRepository();
const manageTimetable = new ManageTimetable(timetableRepo, teacherRepo);
const controller = new TimetableController(manageTimetable);

router.put('/:classId/assign', authenticateUser, controller.assignTeacher.bind(controller));
router.put('/:classId/update', authenticateUser, controller.updateTimetableSlot.bind(controller));
router.delete(
  '/:classId/slot',
  authenticateUser,
  controller.deleteTimetableSlot.bind(controller)
);
router.get('/:classId', authenticateUser, controller.getTimetable.bind(controller));

export default router;
