import express from 'express';
import { ClassController } from '../../controllers/admin/classController.js';
// import { authenticateAdmin } from '../middleware/adminMiddleware.js';
import { SubjectController } from '../../controllers/admin/subjectController.js';

const router = express.Router();

router.post('/class', ClassController.addClasses);
router.get('/classdata', ClassController.getClasses);
router.put('/update/:id', ClassController.updateClass);
router.get('/:classId/subject', SubjectController.fetchSubjectsByClassId);

router.get('/classNames', ClassController.getAllClassNames);
router.get('/classlist', ClassController.fetchClasses);
router.post('/:grade/subjects', SubjectController.createSubject);
router.get('/:grade/subjects', SubjectController.getClassSubjects);
router.delete('/:classId/subjects/:subjectId', SubjectController.deleteSubject);
// router.put('/:classId/subjects/:subjectId', SubjectController.updateSubject);
// router.delete('/:classId/subjects/:subjectId', SubjectController.deleteSubject);

export default router;
