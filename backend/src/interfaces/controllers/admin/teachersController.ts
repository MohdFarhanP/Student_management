import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus';
import { IGetTeachersByLimitUseCase } from '../../../domain/interface/IGetTeachersByLimitUseCase';
import { IGetAllTeachersUseCase } from '../../../domain/interface/IGetAllTeachersUseCase';
import { IAddTeacherUseCase } from '../../../domain/interface/IAddTeacherUseCase';
import { IEditTeacherUseCase } from '../../../domain/interface/IEditTeacherUseCase';
import { IDeleteTeacherUseCase } from '../../../domain/interface/IDeleteTeacherUseCase';
import { ITeacherController } from '../../../domain/interface/ITeacherController';
import { IApiResponse, TeacherNameDTO } from '../../../domain/types/interfaces';
import { ITeacher } from '../../../domain/types/interfaces';
import { Teacher } from '../../../domain/entities/teacher';
import { IFetchTeacherClassesUseCase } from '../../../domain/interface/IFetchTeacherClassesUseCase';
import { IFetchTodayScheduleUseCase } from '../../../domain/interface/IFetchTodayScheduleUseCase';
import { IFetchLiveSessionsUseCase } from '../../../domain/interface/IFetchLiveSessionsUseCase';

export class TeacherController implements ITeacherController {
  constructor(
    private getTeachersByLimitUseCase: IGetTeachersByLimitUseCase,
    private editTeacherUseCase: IEditTeacherUseCase,
    private getAllTeachersUseCase: IGetAllTeachersUseCase,
    private addTeacherUseCase: IAddTeacherUseCase,
    private deleteTeacherUseCase: IDeleteTeacherUseCase,
    private fetchTeacherClassesUseCase: IFetchTeacherClassesUseCase,
    private fetchTodayScheduleUseCase: IFetchTodayScheduleUseCase,
    private fetchLiveSessionsUseCase: IFetchLiveSessionsUseCase,

  ) {}

  async getTeachers(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { teachers, totalCount } = await this.getTeachersByLimitUseCase.execute(page, limit);
      if (totalCount === 0) {
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'No teachers found',
          data: { teachers: [], totalCount: 0 },
        } as IApiResponse<{ teachers: Teacher[]; totalCount: number }>);
        return;
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Teachers fetched successfully',
        data: { teachers, totalCount },
      } as IApiResponse<{ teachers: Teacher[]; totalCount: number }>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async getAllTeachers(req: Request, res: Response): Promise<void> {
    try {
      const teachers = await this.getAllTeachersUseCase.execute();
      if (teachers.length === 0) {
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'No teachers found',
          data: [],
        } as IApiResponse<TeacherNameDTO[]>);
        return;
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'All teachers fetched successfully',
        data: teachers,
      } as IApiResponse<Teacher[]>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async addTeacher(req: Request, res: Response): Promise<void> {
    try {
      const teacherData: Partial<ITeacher> = req.body;
      const newTeacher = await this.addTeacherUseCase.execute(teacherData);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Teacher added successfully',
        data: newTeacher,
      } as IApiResponse<Teacher>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async editTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { teacherId } = req.params;
      const teacherData: Partial<ITeacher> = req.body;
      const updatedTeacher = await this.editTeacherUseCase.execute(teacherId, teacherData);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Teacher updated successfully',
        data: updatedTeacher,
      } as IApiResponse<Teacher>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async deleteTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { teacherId } = req.params;
      await this.deleteTeacherUseCase.execute(teacherId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Teacher deleted successfully',
      } as IApiResponse<never>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async getClasses(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = req.user.id; // From authenticateUser middleware
      const classes = await this.fetchTeacherClassesUseCase.execute(teacherId);
      res.status(HttpStatus.OK).json({ success: true, message: 'Classes fetched successfully', data: classes });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
    }
  }

  async getTodaySchedule(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = req.user.id;
      const schedule = await this.fetchTodayScheduleUseCase.execute(teacherId);
      res.status(HttpStatus.OK).json({ success: true, message: 'Schedule fetched successfully', data: schedule });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
    }
  }

  async getLiveSessions(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = req.user.id;
      const sessions = await this.fetchLiveSessionsUseCase.execute(teacherId);
      res.status(HttpStatus.OK).json({ success: true, message: 'Sessions fetched successfully', data: sessions });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
    }
  }
}