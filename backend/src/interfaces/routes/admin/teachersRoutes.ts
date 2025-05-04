import express from 'express';
import { ITeacherController } from '../../../domain/interface/ITeacherController';
import { authenticateUser } from '../../middleware/authenticateUser';

const router = express.Router();

let teacherController: ITeacherController | null = null;

export const setTeacherController = (controller: ITeacherController) => {
  teacherController = controller;
};

router.get('/teachers', authenticateUser, (req, res, next) => {
  if (!teacherController) {
    throw new Error('TeacherController not initialized. Dependency injection failed.');
  }
  teacherController.getTeachers.bind(teacherController)(req, res, next);
});

router.get('/all', authenticateUser, (req, res, next) => {
  if (!teacherController) {
    throw new Error('TeacherController not initialized. Dependency injection failed.');
  }
  teacherController.getAllTeachers.bind(teacherController)(req, res, next);
});

router.post('/teacher', authenticateUser, (req, res, next) => {
  if (!teacherController) {
    throw new Error('TeacherController not initialized. Dependency injection failed.');
  }
  teacherController.addTeacher.bind(teacherController)(req, res, next);
});

router.put('/:teacherId', authenticateUser, (req, res, next) => {
  if (!teacherController) {
    throw new Error('TeacherController not initialized. Dependency injection failed.');
  }
  teacherController.editTeacher.bind(teacherController)(req, res, next);
});

router.delete('/:teacherId', authenticateUser, (req, res, next) => {
  if (!teacherController) {
    throw new Error('TeacherController not initialized. Dependency injection failed.');
  }
  teacherController.deleteTeacher.bind(teacherController)(req, res, next);
});

export default router;