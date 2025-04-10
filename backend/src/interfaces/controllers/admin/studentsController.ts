import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus.js';
import { GetAllStudentsUseCase } from '../../../application/useCases/admin/student/getAllStudentsUseCase.js';
import { AddStudentUseCase } from '../../../application/useCases/admin/student/addStudentUseCase.js';
import { EditStudentUseCase } from '../../../application/useCases/admin/student/editStudentUseCase.js';
import { DeleteStudentUseCase } from '../../../application/useCases/admin/student/deleteStudentUseCase.js';
import { IStudent } from '../../../domain/interface/IStudent.js';
import { GetStudentProfileUseCase } from '../../../application/useCases/student/GetStudentProfileUseCase.js';
import { Student } from '../../../domain/entities/student.js';

export class StudentController {
  constructor(
    private getAllStudentsUseCase: GetAllStudentsUseCase,
    private addStudentUseCase: AddStudentUseCase,
    private editStudentUseCase: EditStudentUseCase,
    private deleteStudentUseCase: DeleteStudentUseCase,
    private getStudentProfileUseCase: GetStudentProfileUseCase,
    private getStudentsByClassUseCase: GetStudentsByClassUseCase
  ) {}

  async getStudents(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { students, totalCount } = await this.getAllStudentsUseCase.execute(
        page,
        limit
      );
      if (totalCount === 0) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'No students found' });
        return;
      }
      res.status(HttpStatus.OK).json({ students, totalCount });
      return;
    } catch (error) {
      console.error('Error fetching students:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
      return;
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const profile = await this.getStudentProfileUseCase.execute(email);
      res.status(HttpStatus.OK).json(profile);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async addStudent(req: Request, res: Response): Promise<void> {
    try {
      const studentData: Partial<IStudent> = req.body;
      const newStudent = await this.addStudentUseCase.execute(studentData);
      res.status(HttpStatus.CREATED).json({
        message: 'Student added successfully',
        data: newStudent,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async editStudent(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const studentData: Partial<IStudent> = req.body;
      const updatedStudent = await this.editStudentUseCase.execute(
        studentId,
        studentData
      );
      res.status(HttpStatus.OK).json({
        message: 'Student updated successfully',
        data: updatedStudent,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async deleteStudent(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      await this.deleteStudentUseCase.execute(studentId);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Student deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
  async getStudentByClass(req: Request,res: Response):Promise<Student[]>{
    try {
      const { classId } = req.params;
      const students = await this.getStudentsByClassUseCase.execute(classId);
      res.status(200).json(students);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
}
