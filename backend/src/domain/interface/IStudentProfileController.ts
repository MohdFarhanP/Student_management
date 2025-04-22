import { Request, Response } from 'express';

export interface IStudentProfileController {
  getProfile(req: Request, res: Response): Promise<void>;
  updateProfileImage(req: Request, res: Response): Promise<void>;
}