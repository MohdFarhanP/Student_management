import { Request, Response } from 'express';
import { IPresignedUrlController } from './IPresignedUrlController';
import { IGeneratePresignedUrlUseCase } from '../../../domain/useCase/IGeneratePresignedUrlUseCase';
import { IApiResponse } from '../../../domain/types/interfaces';
import { HttpStatus } from '../../../domain/types/enums';

export class PresignedUrlController implements IPresignedUrlController {
  constructor(
    private readonly generatePresignedUrlUseCase: IGeneratePresignedUrlUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { fileName, fileType, fileHash, fileSize } = req.body;
      if (!fileName || !fileType || !fileHash || fileSize == null) {
        throw new Error(
          'fileName, fileType, fileHash, and fileSize are required'
        );
      }
      const result = await this.generatePresignedUrlUseCase.execute(
        fileName,
        fileType,
        fileHash,
        fileSize
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Pre-signed URL generated successfully',
        data: result,
      } as IApiResponse<{ signedUrl: string; fileUrl: string }>);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to generate pre-signed URL';
      const status =
        error instanceof Error && error.message.includes('already exists')
          ? HttpStatus.CONFLICT
          : HttpStatus.BAD_REQUEST;
      const data =
        error instanceof Error && error['data'] ? error['data'] : undefined;
      res.status(status).json({
        success: false,
        message,
        data,
      } as IApiResponse<any>);
    }
  }
}
