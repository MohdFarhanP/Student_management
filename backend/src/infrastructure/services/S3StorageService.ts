import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IStorageService } from '../../application/services/IStorageService';

export class S3StorageService implements IStorageService {
  private s3Client: S3Client;
  public bucketName: string;
  public region: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME!;
    this.region = process.env.AWS_REGION!;
    if (!this.bucketName || !this.region) {
      throw new Error('Missing AWS S3 configuration');
    }
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async generatePresignedUrl(
    fileName: string,
    fileType: string
  ): Promise<{ signedUrl: string; fileUrl: string }> {
    const key = `${Date.now()}-${fileName}`;
    const params = {
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
      // ACL: 'public-read', // Removed for private files
    };

    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60,
    });
    const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    return { signedUrl, fileUrl };
  }

  async generatePresignedDownloadUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ResponseContentDisposition: `attachment; filename="${fileKey.split('-').pop()}"`,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60,
    });
    return signedUrl;
  }
}
