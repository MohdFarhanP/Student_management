import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/types/enums';
import { ICreateSubjectUseCase } from '../../../../domain/useCase/ICreateSubjectUseCase';
import { IFetchSubjectsByClassIdUseCase } from '../../../../domain/useCase/IFetchSubjectsByClassIdUseCase';
import { IGetSubjectsByGradeUseCase } from '../../../../domain/useCase/IGetSubjectsByGradeUseCase';
import { IDeleteSubjectUseCase } from '../../../../domain/useCase/IDeleteSubjectUseCase';
import { IUpdateSubjectUseCase } from '../../../../domain/useCase/IUpdateSubjectUseCase';
import { ISubjectController } from './ISubjectController';
import { IApiResponse } from '../../../../domain/types/interfaces';
import { SubjectEntity } from '../../../../domain/entities/subject';
import { Types } from 'mongoose';

export class SubjectController implements ISubjectController {
  constructor(
    private createSubjectUseCase: ICreateSubjectUseCase,
    private fetchSubjectsByClassIdUseCase: IFetchSubjectsByClassIdUseCase,
    private getSubjectsByGradeUseCase: IGetSubjectsByGradeUseCase,
    private deleteSubjectUseCase: IDeleteSubjectUseCase,
    private updateSubjectUseCase: IUpdateSubjectUseCase
  ) {}

  async createSubject(req: Request, res: Response): Promise<void> {
    try {
      const { grade } = req.params;
      const { subjectName, teachers, notes } = req.body;

      const subjectData: Partial<SubjectEntity> = {
        subjectName,
        teachers: teachers?.map((id: string) => new Types.ObjectId(id)) ?? [],
        notes: notes?.filter((note: string) => note.trim()) ?? [],
      };

      const newSubject = await this.createSubjectUseCase.execute(
        grade,
        subjectData
      );
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Subject created successfully',
        data: newSubject,
      } as IApiResponse<SubjectEntity>);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async getSubjectsByGrade(req: Request, res: Response): Promise<void> {
    try {
      const { grade } = req.params;
      const subjects = await this.getSubjectsByGradeUseCase.execute(grade);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Subjects fetched successfully',
        data: subjects,
      } as IApiResponse<SubjectEntity[]>);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async fetchSubjectsByClassId(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const subjects =
        await this.fetchSubjectsByClassIdUseCase.execute(classId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Subjects fetched successfully',
        data: subjects,
      } as IApiResponse<SubjectEntity[]>);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async deleteSubject(req: Request, res: Response): Promise<void> {
    try {
      const { classGrade, subjectId } = req.params;
      const message = await this.deleteSubjectUseCase.execute(
        classGrade,
        subjectId
      );
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

  async updateSubject(req: Request, res: Response): Promise<void> {
    try {
      const { classGrade, subjectId } = req.params;
      const { subjectName, teachers, notes } = req.body;

      const subjectData: Partial<SubjectEntity> = {
        subjectName,
        teachers: teachers?.map((id: string) => new Types.ObjectId(id)) ?? [],
        notes: notes?.filter((note: string) => note.trim()) ?? [],
      };

      const updatedSubject = await this.updateSubjectUseCase.execute(
        classGrade,
        subjectId,
        subjectData
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Subject updated successfully',
        data: updatedSubject,
      } as IApiResponse<SubjectEntity>);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
}
