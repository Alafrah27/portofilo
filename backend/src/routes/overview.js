import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { checkAuthOrigin } from '../middleware/origin.js';
import { getOverview } from '../controllers/overviewController.js';

export function overviewRouter(config) {
  const router = Router();
  router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.use(checkAuthOrigin(config), authenticate(config), requireAdmin);
  router.get('/', getOverview);
  return router;
}
