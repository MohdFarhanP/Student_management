import express from 'express';
import { ClassController } from '../../controllers/admin/classController.js';
// import { authenticateAdmin } from '../middleware/adminMiddleware.js';
import { SubjectController } from '../../controllers/admin/subjectController.js';
import { ClassRepository } from '../../../infrastructure/repositories/admin/classRepository.js';
import { CreateClassUseCase } from '../../../application/useCases/admin/class/createClassUseCase.js';
import { FetchClassUseCase } from '../../../application/useCases/admin/class/fetchClassUseCase.js';
import { GetClassesUseCase } from '../../../application/useCases/admin/class/getAllClasses.js';
import { UpdateClassUseCase } from '../../../application/useCases/admin/class/updateUseCase.js';
import { GetClassNameUseCase } from '../../../application/useCases/admin/class/getClassNames.js';
import { GetStudentsByClassUseCase } from '../../../application/useCases/admin/class/getStudentsByClass.js';
import { StudentRepository } from '../../../infrastructure/repositories/admin/studentRepository.js';
import { CreateSubjectUseCase } from '../../../application/useCases/admin/subject/CreateSubjectUseCase.js';
import { FetchSubjectsByClassIdUseCase } from '../../../application/useCases/admin/subject/FetchSubjectsByClassIdUseCase.js';
import { SubjectRepository } from '../../../infrastructure/repositories/admin/subjectRepository.js';
import { GetSubjectsByClassUseCase } from '../../../application/useCases/admin/subject/GetSubjectUseCase.js';
import { DeleteSubjectUseCase } from '../../../application/useCases/admin/subject/DeleteSubjectUseCase.js';
import { UpdateSubjectUseCase } from '../../../application/useCases/admin/subject/UpdateSubjectUseCase.js';

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

router.post('/class', classController.addClasses.bind(classController));
router.get('/classdata', classController.getClasses.bind(classController));
router.put('/update/:id', classController.updateClass.bind(classController));
router.get(
  '/:classId/subject',
  subjectController.fetchSubjectsByClassId.bind(subjectController)
);

router.get(
  '/classnames',
  classController.getAllClassNames.bind(classController)
);
router.get('/classlist', classController.fetchClasses.bind(classController));
router.post(
  '/:grade/subjects',
  subjectController.createSubject.bind(subjectController)
);
router.get(
  '/:grade/subjects',
  subjectController.getClassSubjects.bind(subjectController)
);
router.get(
  '/:classId/students',
  classController.getStudentByClass.bind(classController)
);
router.delete(
  '/:classGrade/subjects/:subjectId',
  subjectController.deleteSubject.bind(subjectController)
);
router.put(
  '/:classGrade/subjects/:subjectId',
  subjectController.updateSubject.bind(subjectController)
);
// router.put('/:classId/subjects/:subjectId', SubjectController.updateSubject);
// router.delete('/:classId/subjects/:subjectId', SubjectController.deleteSubject);

export default router;
