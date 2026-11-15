import multer from 'multer';
import { HttpError } from '../utils/errors.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 10, fileSize: 5 * 1024 * 1024, fields: 3, fieldSize: 400000, parts: 13 },
  fileFilter(_req, file, callback) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return callback(new HttpError(400, 'Only JPEG, PNG, and WebP images are allowed.'));
    }
    callback(null, true);
  },
}).array('images', 10);

export function projectUpload(req, res, next) {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return next(new HttpError(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400,
        error.code === 'LIMIT_FILE_SIZE' ? 'Each image must be at most 5MB.' : 'Invalid upload: use title, description, an optional website URL, and up to ten images.'));
    }
    if (error && /^(Multipart:|Unexpected end of (form|file))/.test(error.message)) {
      return next(new HttpError(400, 'Malformed multipart upload.'));
    }
    next(error);
  });
}
