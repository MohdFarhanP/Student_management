import { Request, Response } from 'express';

export interface ITeacherProfileController {
  getProfile(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
}
