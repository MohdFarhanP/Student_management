import { IGetStudentProfileUseCase } from '../../../domain/useCase/IGetStudentProfileUseCase';
import { IUpdateStudentProfileImageUseCase } from '../../../domain/useCase/IUpdateStudentProfileImageUseCase';
import { IStudentProfileController } from './IStudentProfileController';
import { Request, Response } from 'express';
import { IApiResponse, IUser } from '../../../domain/types/interfaces';
import { HttpStatus } from '../../../domain/types/enums';
import { StudentEntity } from '../../../domain/entities/student';
import { BadRequestError } from '../../../domain/errors';
import { IStudentFeeDueRepository } from '../../../domain/repositories/IStudentFeeDueRepository';
import { IProcessPaymentUseCase } from '../../../domain/useCase/IProcessPaymentUseCase';
import { IGetStudentInfoUseCase } from '../../../domain/useCase/IGetStudentInfoUseCase';
import { studentInfoDto } from '../../../application/dtos/studentDtos';
import logger from '../../../logger';

export class StudentProfileController implements IStudentProfileController {
  constructor(
    private getStudentProfileUseCase: IGetStudentProfileUseCase,
    private updateStudentProfileImageUseCase: IUpdateStudentProfileImageUseCase,
    private studentFeeDueRepository: IStudentFeeDueRepository,
    private processPaymentUseCase: IProcessPaymentUseCase,
    private getStudentInfoUseCase: IGetStudentInfoUseCase
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
      } as IApiResponse<StudentEntity>);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch profile';
      const status =
        error instanceof BadRequestError
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
      res
        .status(status)
        .json({ success: false, message } as IApiResponse<never>);
    }
  }

  async getBasicInfo(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser | undefined;
      const studentInfo = await this.getStudentInfoUseCase.execute(user.id);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'studentInfo fetched successfully',
        data: studentInfo,
      } as IApiResponse<studentInfoDto>);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch profile';
      const status =
        error instanceof BadRequestError
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
      res
        .status(status)
        .json({ success: false, message } as IApiResponse<never>);
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
      const studentImgUrl = await this.updateStudentProfileImageUseCase.execute(
        user.email,
        profileImage,
        fileHash
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Profile image updated successfully',
        data: studentImgUrl,
      } as IApiResponse<string>);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update profile image';
      const status =
        error instanceof BadRequestError
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
      res
        .status(status)
        .json({ success: false, message } as IApiResponse<never>);
    }
  }
  async getUnpaidDues(req: Request, res: Response): Promise<void> {
    try {
      const studentId = req.user.id;

      if (!studentId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized',
        } as IApiResponse<never>);
        return;
      }

      const unpaidDues =
        await this.studentFeeDueRepository.findUnpaidByStudentId(studentId);

      const duesDto = unpaidDues.map((due) => ({
        id: due.getId(),
        studentId: due.getStudentId(),
        feeTitle: due.getFeeTitle(),
        month: due.getMonth(),
        dueDate: due.getDueDate().toISOString(),
        amount: due.getAmount(),
        isPaid: due.isPaidStatus(),
        paymentId: due.getPaymentId(),
      }));

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Unpaid dues fetched successfully',
        data: duesDto,
      } as IApiResponse<typeof duesDto>);
    } catch (error: any) {
      logger.error('Error fetching unpaid dues:', error);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Internal server error',
      } as IApiResponse<never>);
    }
  }

  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const { feeDueId } = req.body;
      const studentId = req.user.id;

      if (!studentId || !feeDueId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Missing studentId or feeDueId',
        } as IApiResponse<never>);
        return;
      }

      const result = await this.processPaymentUseCase.execute(
        studentId,
        feeDueId
      );

      const payload = {
        order: result.order,
        paymentId: result.paymentId,
      };

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Payment processed successfully',
        data: payload,
      } as IApiResponse<typeof payload>);
    } catch (error: any) {
      logger.error('Error processing payment:', error);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Internal server error',
      } as IApiResponse<never>);
    }
  }
}
