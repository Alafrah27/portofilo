import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { checkAuthOrigin } from '../middleware/origin.js';
import { projectUpload } from '../middleware/projectUpload.js';
import { projectController } from '../controllers/projectController.js';
import { HttpError } from '../utils/errors.js';

export function projectRouter(config, imageStore) {
  const router = Router();
  const controller = projectController(imageStore);
  router.param('id', (_req, _res, next, id) => {
    next(/^[a-f\d]{24}$/i.test(id) ? undefined : new HttpError(400, 'Invalid project ID.'));
  });
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  router.use(checkAuthOrigin(config), authenticate(config), requireAdmin);
  router.post('/', projectUpload, controller.create);
  router.patch('/:id', projectUpload, controller.update);
  router.delete('/:id', controller.remove);
  return router;
}
