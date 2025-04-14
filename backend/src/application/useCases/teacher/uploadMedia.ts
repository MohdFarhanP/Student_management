import { uploadToCloudinary } from "../../../frontend/src/utils/cloudinaryUpload"; // Adjust path as needed

export class UploadMedia {
  async execute(file: Express.Multer.File): Promise<{ url: string; type: "image" | "document" }> {
    const url = await uploadToCloudinary(file);
    if (!url) throw new Error("Failed to upload media to Cloudinary");
    const type = file.mimetype.startsWith("image/") ? "image" : "document";
    return { url, type };
  }
}