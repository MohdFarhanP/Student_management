import { Router } from 'express';
import { IUserController } from '../../domain/interface/IUserController';
import { authenticateUser } from '../middleware/authenticateUser';

const router = Router();

let userController: IUserController | null = null;

export const setUserController = (controller: IUserController) => {
  userController = controller;
};

router.post('/login', (req, res, next) => {
  if (!userController) {
    throw new Error('UserController not initialized. Dependency injection failed.');
  }
  userController.login.bind(userController)(req, res, next);
});

router.post('/logout', (req, res, next) => {
  if (!userController) {
    throw new Error('UserController not initialized. Dependency injection failed.');
  }
  userController.logout.bind(userController)(req, res, next);
});

router.patch('/update-password', authenticateUser, (req, res, next) => {
  if (!userController) {
    throw new Error('UserController not initialized. Dependency injection failed.');
  }
  userController.updatePassword.bind(userController)(req, res, next);
});

router.post('/refresh-token', (req, res, next) => {
  if (!userController) {
    throw new Error('UserController not initialized. Dependency injection failed.');
  }
  userController.refreshToken.bind(userController)(req, res, next);
});

export default router;