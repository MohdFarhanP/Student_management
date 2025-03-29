import express, { Router } from 'express';
import TimetableController from '../../controllers/admin/timeTableController.js';
import TimetableRepository from '../../../infrastructure/repositories/admin/timeTableRepository.js';
import { TeacherRepository } from '../../../infrastructure/repositories/admin/teacherRepository.js';
import ManageTimetable from '../../../application/useCases/admin/timeTable/timetableUseCase.js';

const router: Router = express.Router();
const timetableRepo = new TimetableRepository();
const teacherRepo = new TeacherRepository();
const manageTimetable = new ManageTimetable(timetableRepo, teacherRepo);
const controller = new TimetableController(manageTimetable);

router.put('/:classId/assign', controller.assignTeacher.bind(controller));
router.put('/:classId/update', controller.updateTimetableSlot.bind(controller));
router.delete(
  '/:classId/slot',
  controller.deleteTimetableSlot.bind(controller)
);
router.get('/:classId', controller.getTimetable.bind(controller));

export default router;
