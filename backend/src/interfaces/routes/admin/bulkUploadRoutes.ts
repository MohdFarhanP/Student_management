import express from 'express';
import multer from 'multer';
import { IBulkUploadController } from '../../controllers/admin/bulkUpload/IBulkUploadController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

let bulkUploadController: IBulkUploadController | null = null;

export const setBulkUploadController = (controller: IBulkUploadController) => {
  bulkUploadController = controller;
};

router.post(
  '/students/bulk-upload',
  upload.single('file'),
  (req, res, next) => {
    if (!bulkUploadController) {
      throw new Error(
        'BulkUploadController not initialized. Dependency injection failed.'
      );
    }
    bulkUploadController.uploadStudents.bind(bulkUploadController)(
      req,
      res,
      next
    );
  }
);

router.post(
  '/teachers/bulk-upload',
  upload.single('file'),
  (req, res, next) => {
    if (!bulkUploadController) {
      throw new Error(
        'BulkUploadController not initialized. Dependency injection failed.'
      );
    }
    bulkUploadController.uploadTeachers.bind(bulkUploadController)(
      req,
      res,
      next
    );
  }
);

export default router;
