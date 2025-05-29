import { Request, Response } from 'express';

export interface IBulkUploadController {
  uploadStudents(req: Request, res: Response): Promise<void>;
  uploadTeachers(req: Request, res: Response): Promise<void>;
}
