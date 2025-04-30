export interface INote {
  _id?: string;
  title: string;
  fileUrl: string; // Cloudinary URL
  fileHash: string;
  uploadedBy: string; // Teacher ID
  createdAt: Date;
  updatedAt: Date,
}
