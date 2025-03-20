import { Request, Response } from 'express';
import { BulkUploadStudentUseCase } from '../../application/useCases/student/bulkUploadStudentUseCase.js';
import { BulkUploadTeacherUseCase } from '../../application/useCases/teacher/bulkUploadTeachersUseCase.js';
import { StudentRepository } from '../../infrastructure/repositories/studentRepository.js';
import { TeacherRepository } from '../../infrastructure/repositories/teacherRepository.js';
import { StudentExcelParser } from '../../infrastructure/parsers/StudentExcelParser.js';
import { TeacherExcelParser } from '../../infrastructure/parsers/teacherExcelParser.js';

export class BulkUploadController {
  private studentUseCase: BulkUploadStudentUseCase;
  private teacherUseCase: BulkUploadTeacherUseCase;

  constructor() {
    this.studentUseCase = new BulkUploadStudentUseCase(
      new StudentRepository(),
      new StudentExcelParser()
    );
    this.teacherUseCase = new BulkUploadTeacherUseCase(
      new TeacherRepository(),
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
    } catch (error) {
      console.error('Student bulk upload error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
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
    } catch (error) {
      console.error('Teacher bulk upload error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
  }
}
