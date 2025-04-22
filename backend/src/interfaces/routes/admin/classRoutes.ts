import express from 'express';
import { ClassController } from '../../controllers/admin/classController';
// import { authenticateAdmin } from '../middleware/adminMiddleware.js';
import { SubjectController } from '../../controllers/admin/subjectController';
import { ClassRepository } from '../../../infrastructure/repositories/admin/classRepository';
import { CreateClassUseCase } from '../../../application/useCases/admin/class/createClassUseCase';
import { FetchClassUseCase } from '../../../application/useCases/admin/class/fetchClassUseCase';
import { GetClassesUseCase } from '../../../application/useCases/admin/class/getAllClasses';
import { UpdateClassUseCase } from '../../../application/useCases/admin/class/updateUseCase';
import { GetClassNameUseCase } from '../../../application/useCases/admin/class/getClassNames';
import { GetStudentsByClassUseCase } from '../../../application/useCases/admin/class/getStudentsByClass';
import { StudentRepository } from '../../../infrastructure/repositories/admin/studentRepository';
import { CreateSubjectUseCase } from '../../../application/useCases/admin/subject/CreateSubjectUseCase';
import { FetchSubjectsByClassIdUseCase } from '../../../application/useCases/admin/subject/FetchSubjectsByClassIdUseCase';
import { SubjectRepository } from '../../../infrastructure/repositories/admin/subjectRepository';
import { GetSubjectsByClassUseCase } from '../../../application/useCases/admin/subject/GetSubjectUseCase';
import { DeleteSubjectUseCase } from '../../../application/useCases/admin/subject/DeleteSubjectUseCase';
import { UpdateSubjectUseCase } from '../../../application/useCases/admin/subject/UpdateSubjectUseCase';
import { authenticateUser } from '../../middleware/authenticateUser';

const classRepository = new ClassRepository();
const studentRepository = new StudentRepository();
const subjectRepository = new SubjectRepository();

const createSubjectUseCase = new CreateSubjectUseCase(
  subjectRepository,
  classRepository
);
const fetchSubjectsByClassIdUseCase = new FetchSubjectsByClassIdUseCase(
  subjectRepository,
  classRepository
);
const getSubjectsByClass = new GetSubjectsByClassUseCase(
  subjectRepository,
  classRepository
);
const deleteSubjectUseCase = new DeleteSubjectUseCase(
  subjectRepository,
  classRepository
);
const updateSubjectUseCase = new UpdateSubjectUseCase(
  subjectRepository,
  classRepository
);

const createClassUseCase = new CreateClassUseCase(classRepository);
const fetchClassUseCase = new FetchClassUseCase(classRepository);
const getAllClassesUseCase = new GetClassesUseCase(classRepository);
const updateClassUseCase = new UpdateClassUseCase(classRepository);
const getAllClassNamesUseCase = new GetClassNameUseCase(classRepository);
const getStudentsByClassUseCase = new GetStudentsByClassUseCase(
  studentRepository
);
const classController = new ClassController(
  createClassUseCase,
  fetchClassUseCase,
  getAllClassesUseCase,
  updateClassUseCase,
  getAllClassNamesUseCase,
  getStudentsByClassUseCase
);

const subjectController = new SubjectController(
  createSubjectUseCase,
  fetchSubjectsByClassIdUseCase,
  getSubjectsByClass,
  deleteSubjectUseCase,
  updateSubjectUseCase
);

const router = express.Router();

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
// router.put('/:classId/subjects/:subjectId', SubjectController.updateSubject);
// router.delete('/:classId/subjects/:subjectId', SubjectController.deleteSubject);

export default router;
