import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus.js';
import { GetStudentProfileUseCase } from '../../../application/useCases/student/GetStudentProfileUseCase.js';
import { UpdateStudentProfileImageUseCase } from '../../../application/useCases/student/UpdateStudentProfileImageUseCase.js';

export class StudentController {
  constructor(
    private getStudentProfileUseCase: GetStudentProfileUseCase,
    private updateStudentProfileImageUseCase: UpdateStudentProfileImageUseCase
  ) {}

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      if (!email) throw new Error('Email parameter is required');
      // Optional: Verify req.user.email matches req.params.email
      if (req.user && req.user.email !== email) throw new Error('Unauthorized');
      const profile = await this.getStudentProfileUseCase.execute(email);
      res.status(HttpStatus.OK).json(profile);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async updateProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const { email, profileImage } = req.body;
      if (!email || !profileImage)
        throw new Error('Email and profileImage are required');
      // Verify req.user.email matches the provided email
      if (req.user && req.user.email !== email) throw new Error('Unauthorized');
      const updatedProfile =
        await this.updateStudentProfileImageUseCase.execute(
          email,
          profileImage
        );
      res.status(HttpStatus.OK).json(updatedProfile);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
}
