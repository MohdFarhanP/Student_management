import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus.js';
import { GetTeacherProfileUseCase } from '../../../application/useCases/teacher/getTeacherProfileUseCase.js';
import { UpdateTeacherProfileUseCase } from '../../../application/useCases/teacher/updateTeacherProfileUseCase.js';

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}
export class TeacherController {
  constructor(
    private getTeacherProfileUseCase: GetTeacherProfileUseCase,
    private updateTeacherProfileUseCase: UpdateTeacherProfileUseCase
  ) {}

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const email = (req.user as { email: string })?.email;
      if (!email) throw new Error('Unauthorized');
      const profile = await this.getTeacherProfileUseCase.execute(email);
      res.status(HttpStatus.OK).json(profile);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const profile = req.body;
      if (!profile.email) throw new Error('Email is required');
      const updatedProfile =
        await this.updateTeacherProfileUseCase.execute(profile);
      res.status(HttpStatus.OK).json(updatedProfile);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
}
