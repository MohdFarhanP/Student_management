import express from 'express';
import { IClassController } from '../../../domain/interface/IClassController';
import { ISubjectController } from '../../../domain/interface/ISubjectController';
import { authenticateUser } from '../../middleware/authenticateUser';

const router = express.Router();

let classController: IClassController | null = null;
let subjectController: ISubjectController | null = null;

export const setClassControllers = (controllers: {
  classController: IClassController;
  subjectController: ISubjectController;
}) => {
  classController = controllers.classController;
  subjectController = controllers.subjectController;
};

router.post('/class', authenticateUser, (req, res, next) => {
  if (!classController) {
    throw new Error('ClassController not initialized. Dependency injection failed.');
  }
  classController.addClasses.bind(classController)(req, res, next);
});

router.get('/classdata', authenticateUser, (req, res, next) => {
  if (!classController) {
    throw new Error('ClassController not initialized. Dependency injection failed.');
  }
  classController.getClasses.bind(classController)(req, res, next);
});

router.put('/update/:id', authenticateUser, (req, res, next) => {
  if (!classController) {
    throw new Error('ClassController not initialized. Dependency injection failed.');
  }
  classController.updateClass.bind(classController)(req, res, next);
});

router.get('/:classId/subject', authenticateUser, (req, res, next) => {
  if (!subjectController) {
    throw new Error('SubjectController not initialized. Dependency injection failed.');
  }
  subjectController.fetchSubjectsByClassId.bind(subjectController)(req, res, next);
});

router.get('/class', authenticateUser, (req, res, next) => {
  if (!classController) {
    throw new Error('ClassController not initialized. Dependency injection failed.');
  }
  classController.getAllClassNames.bind(classController)(req, res, next);
});

router.get('/classlist', authenticateUser, (req, res, next) => {
  if (!classController) {
    throw new Error('ClassController not initialized. Dependency injection failed.');
  }
  classController.fetchClasses.bind(classController)(req, res, next);
});

router.post('/:grade/subjects', authenticateUser, (req, res, next) => {
  if (!subjectController) {
    throw new Error('SubjectController not initialized. Dependency injection failed.');
  }
  subjectController.createSubject.bind(subjectController)(req, res, next);
});

router.get('/top-classes', authenticateUser, (req, res, next) => {
  if (!classController) {
    throw new Error('ClassController not initialized. Dependency injection failed.');
  }
  classController.getTopClass.bind(classController)(req, res, next);
});

router.get('/weekly-attendance/:classId', authenticateUser, (req, res, next) => {
    if (!classController) {
      return next(new Error('ClassController not initialized. Dependency injection failed.'));
    }
    classController.getWeeklyAttendance.bind(classController)(req, res, next);
  });

router.get('/:grade/subjects', authenticateUser, (req, res, next) => {
  if (!subjectController) {
    throw new Error('SubjectController not initialized. Dependency injection failed.');
  }
  subjectController.getSubjectsByGrade.bind(subjectController)(req, res, next);
});

router.get('/:classId/students', authenticateUser, (req, res, next) => {
  if (!classController) {
    throw new Error('ClassController not initialized. Dependency injection failed.');
  }
  classController.getStudentByClass.bind(classController)(req, res, next);
});

router.get('/:classId/studentsId', authenticateUser, (req, res, next) => {
  if (!classController) {
    throw new Error('ClassController not initialized. Dependency injection failed.');
  }
  classController.getStudentIdByClass.bind(classController)(req, res, next);
});

router.delete('/:classGrade/subjects/:subjectId', authenticateUser, (req, res, next) => {
  if (!subjectController) {
    throw new Error('SubjectController not initialized. Dependency injection failed.');
  }
  subjectController.deleteSubject.bind(subjectController)(req, res, next);
});

router.put('/:classGrade/subjects/:subjectId', authenticateUser, (req, res, next) => {
  if (!subjectController) {
    throw new Error('SubjectController not initialized. Dependency injection failed.');
  }
  subjectController.updateSubject.bind(subjectController)(req, res, next);
});

export default router;