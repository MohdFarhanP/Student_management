import { Request, Response } from 'express';
import { IPresignedUrlController } from '../../domain/interface/IPresignedUrlController';
import { IGeneratePresignedUrlUseCase } from '../../domain/interface/IGeneratePresignedUrlUseCase';

export class PresignedUrlController implements IPresignedUrlController {
  constructor(private readonly generatePresignedUrlUseCase: IGeneratePresignedUrlUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      res.status(400).json({ error: 'Missing fileName or fileType' });
      return;
    }

    try {
      const result = await this.generatePresignedUrlUseCase.execute(fileName, fileType);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: `Failed to generate pre-signed URL: ${error.message}` });
    }
  }
}   