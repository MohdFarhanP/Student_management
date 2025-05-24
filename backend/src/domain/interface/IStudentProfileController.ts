import { Request, Response } from 'express';

export interface IStudentProfileController {
  getProfile(req: Request, res: Response): Promise<void>;
  updateProfileImage(req: Request, res: Response): Promise<void>;
  getUnpaidDues(req: Request, res: Response): Promise<void>;
  processPayment(req: Request, res: Response): Promise<void>;
  getBasicInfo(req: Request, res: Response): Promise<void>
}