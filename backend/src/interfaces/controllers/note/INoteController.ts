import { Request, Response } from 'express';

export interface INoteController {
  uploadNote(req: Request, res: Response): Promise<void>;
  downloadNote(req: Request, res: Response): Promise<void>;
  getAllNotes(req: Request, res: Response): Promise<void>;
}
