import { Router } from 'express';
import { IPresignedUrlController } from '../../domain/interface/IPresignedUrlController';

const router: Router = Router();

let presignedUrlController: IPresignedUrlController | null = null;

export const setPresignedUrlController = (controller: IPresignedUrlController) => {
  presignedUrlController = controller;
};

router.post('/', (req, res) => {
  if (!presignedUrlController) {
    throw new Error('PresignedUrlController not initialized. Dependency injection failed.');
  }
  presignedUrlController.handle(req, res);
});

export default router;