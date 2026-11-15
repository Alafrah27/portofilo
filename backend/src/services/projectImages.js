import { v2 as cloudinary } from 'cloudinary';
import { HttpError } from '../utils/errors.js';

export function createProjectImageStore(config) {
  const credentials = config.cloudinary;
  function options() {
    if (!credentials?.cloudName || !credentials?.apiKey || !credentials?.apiSecret) {
      throw new HttpError(503, 'Image storage is not configured.');
    }
    return { cloud_name: credentials.cloudName, api_key: credentials.apiKey, api_secret: credentials.apiSecret };
  }
  return {
    async upload(file) {
      const settings = options();
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({
            ...settings, folder: 'musdar/projects', resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], timeout: 60000,
          }, (error, result) => error ? reject(error) : resolve(result));
          stream.on('error', reject);
          stream.end(file.buffer);
        });
        return { url: result.secure_url, publicId: result.public_id };
      } catch (error) {
        throw new HttpError(error.http_code === 400 ? 400 : 502,
          error.http_code === 400 ? 'Invalid image file.' : 'Image upload failed. Please try again.');
      }
    },
    async remove(publicId) {
      const result = await cloudinary.uploader.destroy(publicId, {
        ...options(), resource_type: 'image', invalidate: true, timeout: 60000,
      });
      if (!['ok', 'not found'].includes(result.result)) throw new Error('Image deletion failed.');
    },
  };
}
