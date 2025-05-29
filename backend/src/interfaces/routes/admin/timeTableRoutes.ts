import express, { Router } from 'express';
import { ITimetableController } from '../../controllers/admin/timetable/ITimetableController';
import { authenticateUser } from '../../middleware/authenticateUser';

const router: Router = express.Router();

let timetableController: ITimetableController | null = null;

export const setTimetableController = (controller: ITimetableController) => {
  timetableController = controller;
};

router.patch('/:classId/assign', authenticateUser, (req, res, next) => {
  if (!timetableController) {
    throw new Error(
      'TimetableController not initialized. Dependency injection failed.'
    );
  }
  timetableController.assignTeacher.bind(timetableController)(req, res, next);
});

router.patch('/:classId/slot', authenticateUser, (req, res, next) => {
  if (!timetableController) {
    throw new Error(
      'TimetableController not initialized. Dependency injection failed.'
    );
  }
  timetableController.updateTimetableSlot.bind(timetableController)(
    req,
    res,
    next
  );
});

router.delete('/:classId/slot', authenticateUser, (req, res, next) => {
  if (!timetableController) {
    throw new Error(
      'TimetableController not initialized. Dependency injection failed.'
    );
  }
  timetableController.deleteTimetableSlot.bind(timetableController)(
    req,
    res,
    next
  );
});

router.get('/:classId', authenticateUser, (req, res, next) => {
  if (!timetableController) {
    throw new Error(
      'TimetableController not initialized. Dependency injection failed.'
    );
  }
  timetableController.getTimetable.bind(timetableController)(req, res, next);
});

router.get('/today/:classId', authenticateUser, (req, res, next) => {
  if (!timetableController) {
    throw new Error(
      'TimetableController not initialized. Dependency injection failed.'
    );
  }
  timetableController.getTimetableForToday.bind(timetableController)(
    req,
    res,
    next
  );
});

export default router;
