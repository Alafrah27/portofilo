import { HttpError } from '../utils/errors.js';

export function checkAuthOrigin(config) {
  return (req, _res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      const origin = req.get('origin');
      if ((origin && !config.adminOrigins.includes(origin))
        || (!origin && req.get('sec-fetch-site') === 'cross-site')) {
        return next(new HttpError(403, 'Origin not allowed.'));
      }
    }
    next();
  };
}
