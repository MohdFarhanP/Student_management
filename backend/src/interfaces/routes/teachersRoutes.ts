import express from 'express';
import { GetAllTeachersUseCase } from '../../application/useCases/teacher/getAllTeachersUseCase.js';
import { TeacherController } from '../controllers/teachersController.js';
import { GetTeachersByLimitUseCase } from '../../application/useCases/teacher/getTeachersByLimitUseCase.js';
import { TeacherRepository } from '../../infrastructure/repositories/teacherRepository.js';
import { EditTeacherUseCase } from '../../application/useCases/teacher/EditTeacherUseCase.js';
import { AddTeacherUseCase } from '../../application/useCases/teacher/addTeacherUseCase.js';
import { DeleteTeacherUseCase } from '../../application/useCases/teacher/deleteTeacherUseCase.js';

const router = express.Router();
const teacherRepository = new TeacherRepository();
const getTeachersByLimitUseCase = new GetTeachersByLimitUseCase(
  teacherRepository
);
const getAllTeachersUseCase = new GetAllTeachersUseCase(teacherRepository);
const editTeacherUseCase = new EditTeacherUseCase(teacherRepository);
const addTeacherUseCase = new AddTeacherUseCase(teacherRepository);
const deleteTeacherUseCase = new DeleteTeacherUseCase(teacherRepository);
const teacherController = new TeacherController(
  getTeachersByLimitUseCase,
  editTeacherUseCase,
  getAllTeachersUseCase,
  addTeacherUseCase,
  deleteTeacherUseCase
);

router.get('/teachers', teacherController.getTeachers.bind(teacherController));
router.post(
  '/addTeacher',
  teacherController.addTeacher.bind(teacherController)
);
router.put(
  '/teacherById/:teacherId',
  teacherController.editTeacher.bind(teacherController)
);
router.get(
  '/allTeachers',
  teacherController.getAllTeachers.bind(teacherController)
);
router.delete(
  '/teacherById/:teacherId',
  teacherController.deleteTeacher.bind(teacherController)
);

export default router;
