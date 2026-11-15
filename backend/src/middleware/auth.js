import { User } from '../model/User.js';
import { HttpError } from '../utils/errors.js';
import { clearAccessCookie, matchesToken, verifyToken } from '../utils/session.js';

export function authenticate(config) {
  return async (req, res, next) => {
    try {
      const token = req.cookies.accessToken;
      const payload = verifyToken(token, 'access', config);
      const user = await User.findById(payload.sub).select('+accessToken');
      if (!user || !matchesToken(token, user.accessToken)) throw new HttpError(401, 'Invalid or expired session.');
      req.user = user;
      next();
    } catch (error) {
      // An expired access token must not discard the still-valid refresh cookie.
      if (error instanceof HttpError) clearAccessCookie(res, config);
      next(error);
    }
  };
}

export function requireAdmin(req, _res, next) {
  if (req.user?.role !== 'admin') return next(new HttpError(403, 'Administrator access required.'));
  next();
}
