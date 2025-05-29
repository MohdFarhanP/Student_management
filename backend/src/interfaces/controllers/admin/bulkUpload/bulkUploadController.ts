import { Request, Response } from 'express';
import { IBulkUploadStudentUseCase } from '../../../../domain/useCase/IBulkUploadStudentUseCase';
import { IBulkUploadTeacherUseCase } from '../../../../domain/useCase/IBulkUploadTeacherUseCase';
import {
  IApiResponse,
  IBulkUploadResult,
} from '../../../../domain/types/interfaces';
import { IBulkUploadController } from './IBulkUploadController';

export class BulkUploadController implements IBulkUploadController {
  constructor(
    private studentUseCase: IBulkUploadStudentUseCase,
    private teacherUseCase: IBulkUploadTeacherUseCase
  ) {}

  async uploadStudents(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
        } as IApiResponse<never>);
        return;
      }

      const result = await this.studentUseCase.execute(req.file.buffer);

      res.status(200).json({
        success: true,
        message: 'Student bulk upload successful',
        data: { addedCount: result.addedCount },
      } as IApiResponse<IBulkUploadResult>);
    } catch (error: unknown) {
      console.error('Student bulk upload error:', error);

      if (typeof error === 'object' && error !== null && 'code' in error) {
        const mongoError = error as { code: number };
        if (mongoError.code === 11000) {
          res.status(400).json({
            success: false,
            message: 'Some students already exist in the database.',
          } as IApiResponse<never>);
          return;
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Internal Server Error';
      res.status(500).json({
        success: false,
        message: errorMessage,
      } as IApiResponse<never>);
    }
  }

  async uploadTeachers(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
        } as IApiResponse<never>);
        return;
      }

      const result = await this.teacherUseCase.execute(req.file.buffer);

      res.status(200).json({
        success: true,
        message: 'Teacher bulk upload successful',
        data: { addedCount: result.addedCount },
      } as IApiResponse<IBulkUploadResult>);
    } catch (error: unknown) {
      console.error('Teacher bulk upload error:', error);

      if (typeof error === 'object' && error !== null && 'code' in error) {
        const mongoError = error as { code: number };
        if (mongoError.code === 11000) {
          res.status(400).json({
            success: false,
            message: 'Some teachers already exist in the database.',
          } as IApiResponse<never>);
          return;
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Internal Server Error';
      res.status(500).json({
        success: false,
        message: errorMessage,
      } as IApiResponse<never>);
    }
  }
}
