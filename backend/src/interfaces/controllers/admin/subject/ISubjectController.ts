import { Request, Response } from 'express';

export interface ISubjectController {
  createSubject(req: Request, res: Response): Promise<void>;
  getSubjectsByGrade(req: Request, res: Response): Promise<void>;
  fetchSubjectsByClassId(req: Request, res: Response): Promise<void>;
  deleteSubject(req: Request, res: Response): Promise<void>;
  updateSubject(req: Request, res: Response): Promise<void>;
}
