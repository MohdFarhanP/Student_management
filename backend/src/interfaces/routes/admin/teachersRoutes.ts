import express from 'express';
import { GetAllTeachersUseCase } from '../../../application/useCases/admin/teacher/getAllTeachersUseCase';
import { TeacherController } from '../../controllers/admin/teachersController';
import { GetTeachersByLimitUseCase } from '../../../application/useCases/admin/teacher/getTeachersByLimitUseCase';
import { TeacherRepository } from '../../../infrastructure/repositories/admin/teacherRepository';
import { EditTeacherUseCase } from '../../../application/useCases/admin/teacher/editTeacherUseCase';
import { AddTeacherUseCase } from '../../../application/useCases/admin/teacher/addTeacherUseCase';
import { DeleteTeacherUseCase } from '../../../application/useCases/admin/teacher/deleteTeacherUseCase';
import { AuthService } from '../../../application/services/authService';
import { authenticateUser } from '../../middleware/authenticateUser';

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

router.get('/teachers', authenticateUser, teacherController.getTeachers.bind(teacherController));
router.post(
  '/addTeacher',
  authenticateUser,
  teacherController.addTeacher.bind(teacherController)
);
router.put(
  '/teacherById/:teacherId',
  authenticateUser,
  teacherController.editTeacher.bind(teacherController)
);
router.get(
  '/allTeachers',
  authenticateUser,
  teacherController.getAllTeachers.bind(teacherController)
);
router.delete(
  '/teacherById/:teacherId',
  authenticateUser,
  teacherController.deleteTeacher.bind(teacherController)
);

export default router;
