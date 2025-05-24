import { IGetStudentProfileUseCase } from '../../../domain/interface/IGetStudentProfileUseCase';
import { IUpdateStudentProfileImageUseCase } from '../../../domain/interface/IUpdateStudentProfileImageUseCase';
import { IStudentProfileController } from '../../../domain/interface/IStudentProfileController';
import { Request, Response } from 'express';
import { IApiResponse,IUser, studentInfoDto } from '../../../domain/types/interfaces';
import HttpStatus from '../../../utils/httpStatus';
import { Student } from '../../../domain/entities/student';
import { BadRequestError } from '../../../domain/errors';
import { IStudentFeeDueRepository } from '../../../domain/interface/IStudentFeeDueRepository';
import { IProcessPaymentUseCase } from '../../../domain/interface/IProcessPaymentUseCase';
import { IGetStudentInfoUseCase } from '../../../domain/interface/IGetStudentInfoUseCase';

export class StudentProfileController implements IStudentProfileController {
  constructor(
    private getStudentProfileUseCase: IGetStudentProfileUseCase,
    private updateStudentProfileImageUseCase: IUpdateStudentProfileImageUseCase,
    private studentFeeDueRepository: IStudentFeeDueRepository,
    private processPaymentUseCase: IProcessPaymentUseCase,
    private getStudentInfoUseCase: IGetStudentInfoUseCase,
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
    async getUnpaidDues(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user.id; // From auth middleware

      if (!studentId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized',
        } as IApiResponse<never>);
        return;
      }

      const unpaidDues = await this.studentFeeDueRepository.findUnpaidByStudentId(studentId);

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
      console.error('Error fetching unpaid dues:', error);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Internal server error',
      } as IApiResponse<never>);
    }
  }

  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const { feeDueId } = req.body;
      console.log('feedueid',feeDueId)
      const studentId = req.user.id;
      console.log('studentId',studentId);

      if (!studentId || !feeDueId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Missing studentId or feeDueId',
        } as IApiResponse<never>);
        return;
      }

      const result = await this.processPaymentUseCase.execute(studentId, feeDueId);
      
      console.log('result form processpyamentusecase' ,result);
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
      console.error('Error processing payment:', error);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Internal server error',
      } as IApiResponse<never>);
    }
  }
}