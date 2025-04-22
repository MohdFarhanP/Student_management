import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus';
import { GetStudentProfileUseCase } from '../../../application/useCases/student/GetStudentProfileUseCase';
import { UpdateStudentProfileImageUseCase } from '../../../application/useCases/student/UpdateStudentProfileImageUseCase';
import { IStudentProfileController } from '../../../domain/interface/IStudentProfileController';
import { IApiResponse } from '../../../domain/types/interfaces';
import { Student } from '../../../domain/entities/student';
import { IUser } from '../../../domain/types/interfaces';

export class StudentProfileController implements IStudentProfileController {
  constructor(
    private getStudentProfileUseCase: GetStudentProfileUseCase,
    private updateStudentProfileImageUseCase: UpdateStudentProfileImageUseCase
  ) {}

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        throw new Error('Valid email parameter is required');
      }
      const user = req.user as IUser | undefined;
      if (!user || user.email !== email) {
        throw new Error('Unauthorized: You can only access your own profile');
      }
      const profile = await this.getStudentProfileUseCase.execute(email);
      if (!profile) {
        throw new Error('Student profile not found');
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Profile fetched successfully',
        data: profile,
      } as IApiResponse<Student>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async updateProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const { email, profileImage } = req.body;
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        throw new Error('Valid email is required');
      }
      if (!profileImage || typeof profileImage !== 'string') {
        throw new Error('Valid profileImage URL is required');
      }
      const user = req.user as IUser | undefined;
      if (!user || user.email !== email) {
        throw new Error('Unauthorized: You can only update your own profile');
      }
      const updatedProfile = await this.updateStudentProfileImageUseCase.execute(
        email,
        profileImage
      );
      if (!updatedProfile) {
        throw new Error('Profile update failed');
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Profile image updated successfully',
        data: updatedProfile,
      } as IApiResponse<Student>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
}