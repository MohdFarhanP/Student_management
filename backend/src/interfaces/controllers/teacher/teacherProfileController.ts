import { Request, Response } from 'express';
import { HttpStatus } from '../../../domain/types/enums';
import { GetTeacherProfileUseCase } from '../../../application/useCases/teacher/getTeacherProfileUseCase';
import { UpdateTeacherProfileUseCase } from '../../../application/useCases/teacher/updateTeacherProfileUseCase';
import { ITeacherProfileController } from './ITeacherProfileController';
import { IApiResponse } from '../../../domain/types/interfaces';
import { TeacherEntity } from '../../../domain/entities/teacher';
import { IUser } from '../../../domain/types/interfaces';

export class TeacherProfileController implements ITeacherProfileController {
  constructor(
    private getTeacherProfileUseCase: GetTeacherProfileUseCase,
    private updateTeacherProfileUseCase: UpdateTeacherProfileUseCase
  ) {}

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser | undefined;
      if (
        !user?.email ||
        typeof user.email !== 'string' ||
        !user.email.includes('@')
      ) {
        throw new Error('Unauthorized: Valid email required');
      }
      const profile = await this.getTeacherProfileUseCase.execute(user.email);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Profile fetched successfully',
        data: profile,
      } as IApiResponse<TeacherEntity>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser | undefined;
      const profile = req.body as Partial<TeacherEntity>;
      if (
        !profile.email ||
        typeof profile.email !== 'string' ||
        !profile.email.includes('@')
      ) {
        throw new Error('Valid email is required');
      }
      if (!user?.email || user.email !== profile.email) {
        throw new Error('Unauthorized: You can only update your own profile');
      }
      if (
        profile.phoneNo &&
        (typeof profile.phoneNo !== 'number' || profile.phoneNo <= 0)
      ) {
        throw new Error('Valid phone number is required');
      }
      if (
        profile.dateOfBirth &&
        !/^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth)
      ) {
        throw new Error('Valid date of birth (YYYY-MM-DD) is required');
      }
      const updatedProfile =
        await this.updateTeacherProfileUseCase.execute(profile);
      if (!updatedProfile) {
        throw new Error('Profile update failed');
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      } as IApiResponse<TeacherEntity>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
}
