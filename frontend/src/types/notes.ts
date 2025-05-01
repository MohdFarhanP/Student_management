export interface INote {
    id: string;
    title: string;
    fileUrl: string;
    uploadedBy: string;
    createdAt: string;
  }
  
export interface NoteUploadParams {
    title: string;
    fileUrl: string;
    fileHash: string;
  }
  