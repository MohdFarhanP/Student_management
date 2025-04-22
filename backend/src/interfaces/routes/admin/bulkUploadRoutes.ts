import express from 'express';
import multer from 'multer';
import { DependencyContainer } from '../../../infrastructure/di/container';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const container = DependencyContainer.getInstance();
const bulkUploadController = container.getBulkUploadController();

router.post('/students/bulk-upload', upload.single('file'), bulkUploadController.uploadStudents.bind(bulkUploadController));
router.post('/teachers/bulk-upload', upload.single('file'), bulkUploadController.uploadTeachers.bind(bulkUploadController));

export default router;