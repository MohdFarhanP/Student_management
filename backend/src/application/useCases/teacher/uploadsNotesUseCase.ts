import { INote } from '../../../domain/interface/INote.js';
import { INoteRepository } from '../../../domain/interface/INotRepository.js';

class UploadNote {
  constructor(private noteRepository: INoteRepository) {}

  async execute(
    title: string,
    fileUrl: string,
    uploadedBy: string
  ): Promise<INote> {
    const note: INote = {
      title,
      fileUrl,
      uploadedBy,
      createdAt: new Date(),
    };
    return this.noteRepository.save(note);
  }
}
export { UploadNote as UploadNoteImpl };
