import express from 'express';
import { GetAllTeachersUseCase } from '../../../application/useCases/admin/teacher/getAllTeachersUseCase.js';
import { TeacherController } from '../../controllers/admin/teachersController.js';
import { GetTeachersByLimitUseCase } from '../../../application/useCases/admin/teacher/getTeachersByLimitUseCase.js';
import { TeacherRepository } from '../../../infrastructure/repositories/admin/teacherRepository.js';
import { EditTeacherUseCase } from '../../../application/useCases/admin/teacher/editTeacherUseCase.js';
import { AddTeacherUseCase } from '../../../application/useCases/admin/teacher/addTeacherUseCase.js';
import { DeleteTeacherUseCase } from '../../../application/useCases/admin/teacher/deleteTeacherUseCase.js';
import { AuthService } from '../../../application/services/authService.js';

const router = express.Router();
const teacherRepository = new TeacherRepository();
const authService = new AuthService();
const getTeachersByLimitUseCase = new GetTeachersByLimitUseCase(
  teacherRepository
);
const getAllTeachersUseCase = new GetAllTeachersUseCase(teacherRepository);
const editTeacherUseCase = new EditTeacherUseCase(teacherRepository);
const addTeacherUseCase = new AddTeacherUseCase(teacherRepository, authService);
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
