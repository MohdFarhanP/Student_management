import axios from 'axios';
import cloudinary from '../../utils/cloudinary';
import { ICloudinaryService } from '../../domain/interface/ICloudinaryService';
import { BadRequestError, NotFoundError } from '../../domain/errors';

export class CloudinaryService implements ICloudinaryService {
  async getFileStream(fileUrl: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }> {
    if (!fileUrl.startsWith('https://res.cloudinary.com')) {
      throw new BadRequestError('Invalid Cloudinary URL');
    }

    try {
      const response = await axios.get(fileUrl, { responseType: 'stream' });
      if (response.status !== 200) {
        throw new NotFoundError(`Failed to fetch file: ${response.statusText}`);
      }
      return {
        stream: response.data,
        contentType: response.headers['content-type'] || 'application/octet-stream',
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        const urlParts = fileUrl.split('/');
        const fileName = urlParts.pop()?.split('.')[0];
        const versionIndex = urlParts.findIndex((part) => part.startsWith('v'));
        const publicId = versionIndex !== -1 ? urlParts.slice(versionIndex + 1).join('/') + '/' + fileName : fileName;
        if (!publicId) {
          throw new BadRequestError('Invalid Cloudinary URL structure');
        }

        const signedUrl = cloudinary.url(publicId, {
          resource_type: 'raw',
          secure: true,
          sign_url: true,
          type: 'authenticated',
        });
        const response = await axios.get(signedUrl, { responseType: 'stream' });
        if (response.status !== 200) {
          throw new NotFoundError(`Failed to fetch signed file: ${response.statusText}`);
        }
        return {
          stream: response.data,
          contentType: response.headers['content-type'] || 'application/octet-stream',
        };
      }
      throw new NotFoundError(error.message || 'Failed to fetch file');
    }
  }
}