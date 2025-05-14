import { Request, Response } from 'express';

export interface IStudentController {
  getStudents(req: Request, res: Response): Promise<void>;
  getProfile(req: Request, res: Response): Promise<void>;
  addStudent(req: Request, res: Response): Promise<void>;
  editStudent(req: Request, res: Response): Promise<void>;
  deleteStudent(req: Request, res: Response): Promise<void>;
  getSessions(req: Request, res: Response): Promise<void>
}