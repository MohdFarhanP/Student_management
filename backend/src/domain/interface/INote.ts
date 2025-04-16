export interface INote {
  _id?: string;
  title: string;
  fileUrl: string; // Cloudinary URL
  uploadedBy: string; // Teacher ID
  createdAt: Date;
}
