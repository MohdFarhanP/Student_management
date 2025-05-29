import { Request, Response } from 'express';

export interface IAttendanceController {
  markAttendance(req: Request, res: Response): Promise<void>;
  batchMarkAttendance(req: Request, res: Response): Promise<void>;
  viewAttendance(req: Request, res: Response): Promise<void>;
  GetRecentSessionAttendance(req: Request, res: Response): Promise<void>;
}
