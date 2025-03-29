import { Request, Response } from 'express';
import { BulkUploadStudentUseCase } from '../../application/useCases/student/bulkUploadStudentUseCase.js';
import { BulkUploadTeacherUseCase } from '../../application/useCases/teacher/bulkUploadTeachersUseCase.js';
import { StudentRepository } from '../../infrastructure/repositories/studentRepository.js';
import { TeacherRepository } from '../../infrastructure/repositories/teacherRepository.js';
import { StudentExcelParser } from '../../infrastructure/parsers/studentExcelParser.js';
import { TeacherExcelParser } from '../../infrastructure/parsers/teacherExcelParser.js';
import { IStudentRepository } from '../../domain/interface/IStudentRepository.js';

export class BulkUploadController {
  private studentUseCase: BulkUploadStudentUseCase;
  private teacherUseCase: BulkUploadTeacherUseCase;

  constructor(
    studentRepository: IStudentRepository = new StudentRepository(),
    teacherRepository: TeacherRepository = new TeacherRepository()
  ) {
    this.studentUseCase = new BulkUploadStudentUseCase(
      studentRepository,
      new StudentExcelParser()
    );
    this.teacherUseCase = new BulkUploadTeacherUseCase(
      teacherRepository,
      new TeacherExcelParser()
    );
  }

  async uploadStudents(req: Request, res: Response) {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const studentResult = await this.studentUseCase.execute(req.file.buffer);

      res.status(200).json({
        message: 'Student bulk upload successful',
        studentsAdded: studentResult.studentsAdded,
      });
      return;
    } catch (error: unknown) {
      console.error('Student bulk upload error:', error);

      if (typeof error === 'object' && error !== null && 'code' in error) {
        const mongoError = error as { code: number };
        if (mongoError.code === 11000) {
          res
            .status(400)
            .json({ message: 'Some students already exist in the database.' });
          return;
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Internal Server Error';
      res.status(500).json({ message: errorMessage });
      return;
    }
  }
  async uploadTeachers(req: Request, res: Response) {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const teacherResult = await this.teacherUseCase.execute(req.file.buffer);

      res.status(200).json({
        message: 'Teacher bulk upload successful',
        teachersAdded: teacherResult.teachersAdded,
      });
      return;
    } catch (error: unknown) {
      console.error('Student bulk upload error:', error);

      if (typeof error === 'object' && error !== null && 'code' in error) {
        const mongoError = error as { code: number };

        if (mongoError.code === 11000) {
          res
            .status(400)
            .json({ message: 'Some teachers already exist in the database.' });
          return;
        }
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Internal Server Error';

      res.status(500).json({ message: errorMessage });
      return;
    }
  }
}
