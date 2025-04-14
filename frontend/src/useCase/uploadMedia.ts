import { uploadToCloudinary } from "../utils/cloudinaryUpload";

export class UploadMedia {
  async execute(file: File): Promise<{ url: string; type: "image" | "document" }> {
    const url = await uploadToCloudinary(file);
    if (!url) throw new Error("Failed to upload media to Cloudinary");
    const type = file.type.startsWith("image/") ? "image" : "document";
    return { url, type };
  }
}