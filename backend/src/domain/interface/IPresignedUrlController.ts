import { Request, Response } from 'express';

export interface IPresignedUrlController {
  handle(req: Request, res: Response): Promise<void>;
}