import { Request, Response } from 'express';

export interface ITeacherController {
  getTeachers(req: Request, res: Response): Promise<void>;
  getAllTeachers(req: Request, res: Response): Promise<void>;
  addTeacher(req: Request, res: Response): Promise<void>;
  editTeacher(req: Request, res: Response): Promise<void>;
  deleteTeacher(req: Request, res: Response): Promise<void>;
}