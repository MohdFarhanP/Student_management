import { Router } from 'express';
import { DependencyContainer } from '../../infrastructure/di/container';

const router: Router = Router();
const container = DependencyContainer.getInstance();
const presignedUrlController = container.getPresignedUrlController();

router.post('/', (req, res) => presignedUrlController.handle(req, res));

export default router;