import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { checkAuthOrigin } from '../middleware/origin.js';
import { taskController } from '../controllers/taskController.js';
import { HttpError } from '../utils/errors.js';

export function taskRouter(config) {
  const router = Router();
  router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.use(checkAuthOrigin(config), authenticate(config), requireAdmin);
  router.param('id', (_req, _res, next, id) => {
    next(/^[a-f\d]{24}$/i.test(id) ? undefined : new HttpError(400, 'Invalid task ID.'));
  });
  router.get('/', taskController.list);
  router.get('/:id', taskController.get);
  router.post('/', taskController.create);
  router.patch('/:id', taskController.update);
  router.delete('/:id', taskController.remove);
  return router;
}
