import { Request, Response } from 'express';
import { CreateSubjectUseCase } from '../../../application/useCases/admin/subject/createSubjectUseCase';
import HttpStatus from '../../../utils/httpStatus';
import { GetSubjectsByClassUseCase } from '../../../application/useCases/admin/subject/getSubjectUseCase';
import { FetchSubjectsByClassIdUseCase } from '../../../application/useCases/admin/subject/fetchSubjectsByClassIdUseCase';
import { DeleteSubjectUseCase } from '../../../application/useCases/admin/subject/deleteSubjectUseCase';
import { UpdateSubjectUseCase } from '../../../application/useCases/admin/subject/updateSubjectUseCase';

export class SubjectController {
  constructor(
    private createSubjectUseCase: CreateSubjectUseCase,
    private fetchSubjectsByClassIdUseCase: FetchSubjectsByClassIdUseCase,
    private getSubjectsByClass: GetSubjectsByClassUseCase,
    private deleteSubjectUseCase: DeleteSubjectUseCase,
    private updateSubjectUseCase: UpdateSubjectUseCase
  ) {}
  async createSubject(req: Request, res: Response) {
    try {
      const { grade } = req.params;
      const { subjectName, teachers, notes } = req.body;

      const subjectData = {
        subjectName,
        teachers,
        notes,
      };

      const newSubject = await this.createSubjectUseCase.execute(
        grade,
        subjectData
      );
      res.status(HttpStatus.CREATED).json({ data: newSubject });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
      return;
    }
  }
  async getClassSubjects(req: Request, res: Response) {
    try {
      const { grade } = req.params;
      const subjects = await this.getSubjectsByClass.execute(grade);
      res.status(200).json(subjects);
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
      return;
    }
  }
  async fetchSubjectsByClassId(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const subjects =
        await this.fetchSubjectsByClassIdUseCase.execute(classId);
      res.status(200).json(subjects);
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
      return;
    }
  }
  async deleteSubject(req: Request, res: Response) {
    try {
      const { classGrade, subjectId } = req.params;
      await this.deleteSubjectUseCase.execute(classGrade, subjectId);
      res
        .status(HttpStatus.OK)
        .json({ message: 'successfully deleted the subject' });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
      return;
    }
  }
  async updateSubject(req: Request, res: Response) {
    try {
      const { classGrade, subjectId } = req.params;
      const { subjectName, teachers, notes } = req.body;

      const subjectData = {
        subjectName,
        teachers,
        notes,
      };
      const result = await this.updateSubjectUseCase.execute(
        classGrade,
        subjectId,
        subjectData
      );
      res
        .status(HttpStatus.OK)
        .json({ message: 'successfully deleted the subject', data: result });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
      return;
    }
  }
}
