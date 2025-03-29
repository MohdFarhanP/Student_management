import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus.js';
import { GetStudentProfileUseCase } from '../../../application/useCases/student/GetStudentProfileUseCase.js';

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}
export class StudentController {
  constructor(private getStudentProfileUseCase: GetStudentProfileUseCase) {}

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const email = (req.user as { email: string })?.email;
      if (!email) throw new Error('Unauthorized');
      const profile = await this.getStudentProfileUseCase.execute(email);
      res.status(HttpStatus.OK).json(profile);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
}
