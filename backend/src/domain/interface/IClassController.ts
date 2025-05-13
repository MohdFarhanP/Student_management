import { Request, Response } from 'express';

export interface IClassController {
  addClasses(req: Request, res: Response): Promise<void>;
  getClasses(req: Request, res: Response): Promise<void>;
  updateClass(req: Request, res: Response): Promise<void>;
  getAllClassNames(req: Request, res: Response): Promise<void>;
  fetchClasses(req: Request, res: Response): Promise<void>;
  getStudentByClass(req: Request, res: Response): Promise<void>;
  getClassesForTeacher(req: Request, res: Response): Promise<void>;
  getClassForStudent(req: Request, res: Response): Promise<void>;
  getStudentIdByClass(req: Request, res: Response): Promise<void>
  getTopClass(req: Request, res: Response): Promise<void>;
  getWeeklyAttendance(req: Request, res: Response): Promise<void>

}