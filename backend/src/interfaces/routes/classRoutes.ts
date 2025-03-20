import express from 'express';
import { ClassController } from '../controllers/classController.js';
import { authenticateAdmin } from '../middleware/adminMiddleware.js';
import { SubjectController } from '../controllers/subjectController.js';

const router = express.Router();

router.post('/class', authenticateAdmin, ClassController.addClasses);
router.get('/class', authenticateAdmin, ClassController.getClasses);
router.put('/update/:id', authenticateAdmin, ClassController.updateClass);
router.get('/classNames', authenticateAdmin, ClassController.getAllClassNames);

router.post(
  '/:grade/subjects',
  authenticateAdmin,
  SubjectController.createSubject
);
router.get('/:grade/subjects', SubjectController.getClassSubjects);
// router.put('/:classId/subjects/:subjectId', SubjectController.updateSubject);
// router.delete('/:classId/subjects/:subjectId', SubjectController.deleteSubject);

export default router;
