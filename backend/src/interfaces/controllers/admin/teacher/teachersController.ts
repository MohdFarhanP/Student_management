import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/types/enums';
import { IGetTeachersByLimitUseCase } from '../../../../domain/useCase/IGetTeachersByLimitUseCase';
import { IGetAllTeachersUseCase } from '../../../../domain/useCase/IGetAllTeachersUseCase';
import { IAddTeacherUseCase } from '../../../../domain/useCase/IAddTeacherUseCase';
import { IEditTeacherUseCase } from '../../../../domain/useCase/IEditTeacherUseCase';
import { IDeleteTeacherUseCase } from '../../../../domain/useCase/IDeleteTeacherUseCase';
import { ITeacherController } from './ITeacherController';
import { IApiResponse } from '../../../../domain/types/interfaces';
import { ITeacher } from '../../../../domain/types/interfaces';
import { TeacherEntity } from '../../../../domain/entities/teacher';
import { IFetchTeacherClassesUseCase } from '../../../../domain/useCase/IFetchTeacherClassesUseCase';
import { IFetchTodayScheduleUseCase } from '../../../../domain/useCase/IFetchTodayScheduleUseCase';
import { IFetchLiveSessionsUseCase } from '../../../../domain/useCase/IFetchLiveSessionsUseCase';
import {
  TeacherDTO,
  TeacherNameDTO,
} from '../../../../application/dtos/teacherDtos';
import { ISearchTeachersUseCase } from '../../../../domain/useCase/ISearchTeachersUseCase';

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
    private searchTeachersUseCase: ISearchTeachersUseCase
  ) {}

  async getTeachers(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { teachers, totalCount } =
        await this.getTeachersByLimitUseCase.execute(page, limit);
      if (totalCount === 0) {
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'No teachers found',
          data: { teachers: [], totalCount: 0 },
        } as IApiResponse<{ teachers: TeacherEntity[]; totalCount: number }>);
        return;
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Teachers fetched successfully',
        data: { teachers, totalCount },
      } as IApiResponse<{ teachers: TeacherEntity[]; totalCount: number }>);
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
      } as IApiResponse<TeacherEntity[]>);
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
      } as IApiResponse<TeacherEntity>);
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
      const updatedTeacher = await this.editTeacherUseCase.execute(
        teacherId,
        teacherData
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Teacher updated successfully',
        data: updatedTeacher,
      } as IApiResponse<TeacherEntity>);
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
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Classes fetched successfully',
        data: classes,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message });
    }
  }

  async getTodaySchedule(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = req.user.id;
      const schedule = await this.fetchTodayScheduleUseCase.execute(teacherId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Schedule fetched successfully',
        data: schedule,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message });
    }
  }

  async getLiveSessions(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = req.user.id;
      const sessions = await this.fetchLiveSessionsUseCase.execute(teacherId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Sessions fetched successfully',
        data: sessions,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message });
    }
  }

  searchTeachers = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.q as string;
      const teachers = await this.searchTeachersUseCase.execute(query);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Teachers searched successfully',
        data: teachers,
      } as IApiResponse<TeacherDTO[]>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  };
}
