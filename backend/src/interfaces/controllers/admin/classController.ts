import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus';
import { ICreateClassUseCase } from '../../../domain/interface/ICreateClassUseCase';
import { IFetchClassUseCase } from '../../../domain/interface/IFetchClassUseCase';
import { IGetClassesUseCase } from '../../../domain/interface/IGetClassesUseCase';
import { IUpdateClassUseCase } from '../../../domain/interface/IUpdateClassUseCase';
import { IGetClassNameUseCase } from '../../../domain/interface/IGetClassNameUseCase';
import { IGetStudentsByClassUseCase } from '../../../domain/interface/IGetStudentsByClassUseCase';
import { IGetClassesForTeacherUseCase } from '../../../domain/interface/IGetClassesForTeacherUseCase';
import { IGetClassForStudentUseCase } from '../../../domain/interface/IGetClassForStudentUseCase';
import { IClassController } from '../../../domain/interface/IClassController';
import { IApiResponse, IClass, StudentIdsDTO } from '../../../domain/types/interfaces';
import { ForbiddenError, NotFoundError } from '../../../domain/errors';
import { IGetStudentsIdByClassUseCase } from '../../../domain/interface/IGetStudentsIdByClassUseCase';

export class ClassController implements IClassController {
  constructor(
    private createClassUseCase: ICreateClassUseCase,
    private fetchClassUseCase: IFetchClassUseCase,
    private getAllClassesUseCase: IGetClassesUseCase,
    private updateClassUseCase: IUpdateClassUseCase,
    private getAllClassNamesUseCase: IGetClassNameUseCase,
    private getStudentsByClassUseCase: IGetStudentsByClassUseCase,
    private getClassesForTeacherUseCase: IGetClassesForTeacherUseCase,
    private getClassForStudentUseCase: IGetClassForStudentUseCase,
    private getStudentsIdByClassUseCase: IGetStudentsIdByClassUseCase
  ) {}

  async addClasses(req: Request, res: Response): Promise<void> {
    try {
      const message = await this.createClassUseCase.execute(req.body);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message,
      } as IApiResponse<never>);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async getClasses(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const { data: classes, totalCount } = await this.getAllClassesUseCase.execute(page, limit);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Classes fetched successfully',
        data: { classes, totalCount },
      } as IApiResponse<{ classes: any[]; totalCount: number }>);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async updateClass(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const message = await this.updateClassUseCase.execute(id, req.body);
      res.status(HttpStatus.OK).json({
        success: true,
        message,
      } as IApiResponse<never>);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async getAllClassNames(req: Request, res: Response): Promise<void> {
    try {
      const grades = await this.getAllClassNamesUseCase.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Class names fetched successfully',
        data: grades,
      } as IApiResponse<{ grade: string }[]>);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async fetchClasses(req: Request, res: Response): Promise<void> {
    try {
      const classes = await this.fetchClassUseCase.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Classes fetched successfully',
        data: classes,
      } as IApiResponse<{ _id: string; name: string }[]>);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async getStudentByClass(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const students = await this.getStudentsByClassUseCase.execute(classId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Students fetched successfully',
        data: students,
      } as IApiResponse<any[]>);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
  async getStudentIdByClass(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const studentIdsDTO: StudentIdsDTO = await this.getStudentsIdByClassUseCase.execute(classId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Student IDs fetched successfully',
        data: studentIdsDTO,
      } as IApiResponse<StudentIdsDTO>);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
  async getClassesForTeacher(req: Request, res: Response): Promise<void> {
    try {
      const classes = await this.getClassesForTeacherUseCase.execute(req.user.id, req.user.role);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Classes fetched successfully',
        data: classes,
      } as IApiResponse<IClass[]>);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: error.message,
        } as IApiResponse<never>);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to fetch classes',
        } as IApiResponse<never>);
      }
    }
  }

  async getClassForStudent(req: Request, res: Response): Promise<void> {
    try {
      const classDoc = await this.getClassForStudentUseCase.execute(req.user.id, req.user.role);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Class fetched successfully',
        data: classDoc,
      } as IApiResponse<Partial<IClass> | null>);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: error.message,
        } as IApiResponse<never>);
      } else if (error instanceof NotFoundError) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: error.message,
        } as IApiResponse<never>);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to fetch class',
        } as IApiResponse<never>);
      }
    }
  }
} 