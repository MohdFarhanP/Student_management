import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus.js';
import { GetTeacherProfileUseCase } from '../../../application/useCases/teacher/getTeacherProfileUseCase.js';

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}
export class TeacherController {
  constructor(private getTeacherProfileUseCase: GetTeacherProfileUseCase) {}

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
}
