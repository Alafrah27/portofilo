import { HttpError } from '../utils/errors.js';

export function notFound(_req, _res, next) {
  next(new HttpError(404, 'Route not found.'));
}

export function errorHandler(error, _req, res, next) {
  if (res.headersSent) return next(error);
  let status = 500;
  let message = 'An unexpected server error occurred.';
  if (error instanceof HttpError) { status = error.status; message = error.message; }
  else if (error.type === 'entity.parse.failed') { status = 400; message = 'Invalid JSON body.'; }
  else if (error.type === 'entity.too.large') { status = 413; message = 'Request body is too large.'; }
  else if (error.name === 'ValidationError' || error.name === 'CastError') { status = 400; message = 'Invalid request data.'; }
  else if (error.code === 11000) { status = 409; message = 'An account with this email already exists.'; }
  if (status === 500) console.error('Request failed:', error.name || 'Error');
  res.status(status).json({ error: { message } });
}
