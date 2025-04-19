import express from 'express';
import multer from 'multer';
import { BulkUploadController } from '../../controllers/admin/bulkUploadController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const bulkUploadController = new BulkUploadController();

router.post('/students/bulk-upload', upload.single('file'), (req, res) =>
  bulkUploadController.uploadStudents(req, res)
);

router.post('/teachers/bulk-upload', upload.single('file'), (req, res) =>
  bulkUploadController.uploadTeachers(req, res)
);

export default router;
