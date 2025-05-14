import express from 'express';
import { IStudentController } from '../../../domain/interface/IStudentController';
import { authenticateUser } from '../../middleware/authenticateUser';

const router = express.Router();

let studentController: IStudentController | null = null;

export const setStudentController = (controller: IStudentController) => {
  studentController = controller;
};

router.get('/students', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error('StudentController not initialized. Dependency injection failed.');
  }
  studentController.getStudents.bind(studentController)(req, res, next);
});

router.post('/student', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error('StudentController not initialized. Dependency injection failed.');
  }
  studentController.addStudent.bind(studentController)(req, res, next);
});

router.put('/:studentId', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error('StudentController not initialized. Dependency injection failed.');
  }
  studentController.editStudent.bind(studentController)(req, res, next);
});

router.delete('/:studentId', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error('StudentController not initialized. Dependency injection failed.');
  }
  studentController.deleteStudent.bind(studentController)(req, res, next);
});

router.get('/profile/:email', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error('StudentController not initialized. Dependency injection failed.');
  }
  studentController.getProfile.bind(studentController)(req, res, next);
});

router.get('/sessions/:userId', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error('StudentController not initialized. Dependency injection failed.');
  }
  studentController.getSessions.bind(studentController)(req, res, next);
});

export default router;