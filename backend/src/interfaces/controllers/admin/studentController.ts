import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus';
import { IGetAllStudentsUseCase } from '../../../domain/interface/IGetAllStudentsUseCase';
import { IAddStudentUseCase } from '../../../domain/interface/IAddStudentUseCase';
import { IEditStudentUseCase } from '../../../domain/interface/IEditStudentUseCase';
import { IDeleteStudentUseCase } from '../../../domain/interface/IDeleteStudentUseCase';
import { IGetStudentProfileUseCase } from '../../../domain/interface/IGetStudentProfileUseCase';
import { IStudentController } from '../../../domain/interface/IStudentController';
import { IApiResponse, ILiveSessionDto } from '../../../domain/types/interfaces';
import { IStudent } from '../../../domain/types/interfaces';
import { Student } from '../../../domain/entities/student';
import { IGetStdSessionsUsecase } from '../../../domain/interface/IGetStdSessionsUsecase';

export class StudentController implements IStudentController {
  constructor(
    private getAllStudentsUseCase: IGetAllStudentsUseCase,
    private addStudentUseCase: IAddStudentUseCase,
    private editStudentUseCase: IEditStudentUseCase,
    private deleteStudentUseCase: IDeleteStudentUseCase,
    private getStudentProfileUseCase: IGetStudentProfileUseCase,
    private getStdSessionsUsecase: IGetStdSessionsUsecase,
  ) {}

  async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { students, totalCount } = await this.getAllStudentsUseCase.execute(page, limit);
      if (totalCount === 0) {
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'No students found',
          data: { students: [], totalCount: 0 },
        } as IApiResponse<{ students: Student[]; totalCount: number }>);
        return;
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Students fetched successfully',
        data: { students, totalCount },
      } as IApiResponse<{ students: Student[]; totalCount: number }>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const profile = await this.getStudentProfileUseCase.execute(email);
      if (!profile) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Student profile not found',
        } as IApiResponse<never>);
        return;
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Profile fetched successfully',
        data: profile,
      } as IApiResponse<Student>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
  async getSessions(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const sessions = await this.getStdSessionsUsecase.execute(userId);
      if (!sessions) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Student sessions not found',
        } as IApiResponse<never>);
        return;
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Student sessions fetched successfully',
        data: sessions,
      } as IApiResponse<ILiveSessionDto[]>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async addStudent(req: Request, res: Response): Promise<void> {
    try {
      const studentData: Partial<IStudent> = req.body;
      const newStudent = await this.addStudentUseCase.execute(studentData);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Student added successfully',
        data: newStudent,
      } as IApiResponse<Student>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async editStudent(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const studentData: Partial<IStudent> = req.body;
      const updatedStudent = await this.editStudentUseCase.execute(studentData.id, studentData);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Student updated successfully',
        data: updatedStudent,
      } as IApiResponse<Student>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async deleteStudent(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      await this.deleteStudentUseCase.execute(studentId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Student deleted successfully',
      } as IApiResponse<never>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
}