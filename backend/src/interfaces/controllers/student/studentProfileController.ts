import { IGetStudentProfileUseCase } from '../../../domain/interface/IGetStudentProfileUseCase';
import { IUpdateStudentProfileImageUseCase } from '../../../domain/interface/IUpdateStudentProfileImageUseCase';
import { IStudentProfileController } from '../../../domain/interface/IStudentProfileController';
import { Request, Response } from 'express';
import { IApiResponse,IUser } from '../../../domain/types/interfaces';
import HttpStatus from '../../../utils/httpStatus';
import { Student } from '../../../domain/entities/student';
import { BadRequestError } from '../../../domain/errors';

export class StudentProfileController implements IStudentProfileController {
  constructor(
    private getStudentProfileUseCase: IGetStudentProfileUseCase,
    private updateStudentProfileImageUseCase: IUpdateStudentProfileImageUseCase
  ) {}

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser | undefined;
      if (!user?.email) {
        throw new BadRequestError('User email is required');
      }
      const student = await this.getStudentProfileUseCase.execute(user.email);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Profile fetched successfully',
        data: student,
      } as IApiResponse<Student>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profile';
      const status = error instanceof BadRequestError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ success: false, message } as IApiResponse<never>);
    }
  }

  async updateProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser | undefined;
      const { profileImage, fileHash } = req.body;
      if (!user?.email) {
        throw new BadRequestError('User email is required');
      }
      if (!profileImage) {
        throw new BadRequestError('Profile image URL is required');
      }
      const studentImgUrl = await this.updateStudentProfileImageUseCase.execute(user.email, profileImage, fileHash);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Profile image updated successfully',
        data: studentImgUrl,
      } as IApiResponse<string>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile image';
      const status = error instanceof BadRequestError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ success: false, message } as IApiResponse<never>);
    }
  }
}