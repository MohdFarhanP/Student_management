import express, { Router } from 'express';
import TimetableController from '../controllers/timeTableController.js';
import TimetableRepository from '../../infrastructure/repositories/timeTableRepository.js';
import { TeacherRepository } from '../../infrastructure/repositories/teacherRepository.js';
import ManageTimetable from '../../application/useCases/timeTable/timetableUseCase.js';

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
