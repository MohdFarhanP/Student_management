import express from 'express';
import { ClassController } from '../controllers/classController.js';
// import { authenticateAdmin } from '../middleware/adminMiddleware.js';
import { SubjectController } from '../controllers/subjectController.js';

const router = express.Router();

router.post('/class', ClassController.addClasses);
router.get('/class', ClassController.getClasses);
router.put('/update/:id', ClassController.updateClass);

router.get('/classNames', ClassController.getAllClassNames);
router.post('/:grade/subjects', SubjectController.createSubject);
router.get('/:grade/subjects', SubjectController.getClassSubjects);
// router.put('/:classId/subjects/:subjectId', SubjectController.updateSubject);
// router.delete('/:classId/subjects/:subjectId', SubjectController.deleteSubject);

export default router;
