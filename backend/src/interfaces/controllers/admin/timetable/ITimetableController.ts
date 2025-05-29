import { Request, Response } from 'express';

export interface ITimetableController {
  assignTeacher(req: Request, res: Response): Promise<void>;
  updateTimetableSlot(req: Request, res: Response): Promise<void>;
  deleteTimetableSlot(req: Request, res: Response): Promise<void>;
  getTimetable(req: Request, res: Response): Promise<void>;
  getTimetableForToday(req: Request, res: Response): Promise<void>;
}
