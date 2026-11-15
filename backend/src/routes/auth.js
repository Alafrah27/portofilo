import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers/authController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { checkAuthOrigin } from '../middleware/origin.js';

export function authRouter(config) {
  const router = Router();
  const controller = authController(config);
  router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.use(checkAuthOrigin(config));
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, limit: 10,
    standardHeaders: 'draft-8', legacyHeaders: false,
    handler: (_req, res) => res.status(429).json({ error: { message: 'Too many login attempts. Try again later.' } }),
  });
  router.post('/login', loginLimiter, controller.login);
  router.post('/refresh', controller.refresh);
  router.post('/logout', controller.logout);
  router.get('/me', authenticate(config), requireAdmin, controller.me);
  return router;
}
