import express from 'express';
import { DependencyContainer } from '../../../infrastructure/di/container';
import { authenticateUser } from '../../middleware/authenticateUser';

const router = express.Router();
const container = DependencyContainer.getInstance();
const classController = container.getClassController();
const subjectController = container.getSubjectController();

router.post('/class', authenticateUser, classController.addClasses.bind(classController));
router.get('/classdata', authenticateUser, classController.getClasses.bind(classController));
router.put('/update/:id', authenticateUser, classController.updateClass.bind(classController));
router.get(
  '/:classId/subject',
  authenticateUser,
  subjectController.fetchSubjectsByClassId.bind(subjectController)
);
router.get(
  '/classnames',
  authenticateUser,
  classController.getAllClassNames.bind(classController)
);
router.get('/classlist', authenticateUser, classController.fetchClasses.bind(classController));
router.post(
  '/:grade/subjects',
  authenticateUser,
  subjectController.createSubject.bind(subjectController)
);
router.get(
  '/:grade/subjects',
  authenticateUser,
  subjectController.getClassSubjects.bind(subjectController)
);
router.get(
  '/:classId/students',
  authenticateUser,
  classController.getStudentByClass.bind(classController)
);
router.delete(
  '/:classGrade/subjects/:subjectId',
  authenticateUser,
  subjectController.deleteSubject.bind(subjectController)
);
router.put(
  '/:classGrade/subjects/:subjectId',
  authenticateUser,
  subjectController.updateSubject.bind(subjectController)
);

export default router;