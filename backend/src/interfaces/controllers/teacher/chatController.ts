import { Request, Response } from 'express';
import { GetMessages } from '../../useCases/getMessages';
import { UploadMedia } from '../../useCases/uploadMedia';

export class ChatController {
  constructor(
    private getMessagesUseCase: GetMessages,
    private uploadMediaUseCase: UploadMedia
  ) {}

  async getMessages(req: Request, res: Response) {
    try {
      const messages = await this.getMessagesUseCase.execute(
        req.params.chatRoomId
      );
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async uploadMedia(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size exceeds 5MB' });
      }
      const { url, type } = await this.uploadMediaUseCase.execute(req.file);
      res.json({ url, type });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
