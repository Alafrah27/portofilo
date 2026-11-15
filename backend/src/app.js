import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { authRouter } from './routes/auth.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { HttpError } from './utils/errors.js';
import { projectRouter } from './routes/projects.js';
import { createProjectImageStore } from './services/projectImages.js';
import { taskRouter } from './routes/tasks.js';

export function createApp(config, { imageStore = createProjectImageStore(config) } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  const adminCors = {
    credentials: true,
    origin(origin, callback) {
      if (!origin || config.adminOrigins.includes(origin)) return callback(null, true);
      callback(new HttpError(403, 'Origin not allowed.'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  };
  app.use(cors((req, callback) => {
    const method = req.method === 'OPTIONS' ? req.get('access-control-request-method') : req.method;
    const publicRead = ['GET', 'HEAD'].includes(method)
      && /^\/api\/projects(?:\/[^/]+)?\/?$/.test(req.path);
    const publicCors = publicRead && !config.adminOrigins.includes(req.get('origin'));
    callback(null, publicCors ? { origin: '*', methods: ['GET', 'HEAD', 'OPTIONS'] } : adminCors);
  }));
  app.use(cookieParser());
  app.use('/api/projects', express.json({ limit: '128kb' }), projectRouter(config, imageStore));
  app.use(express.json({ limit: '10kb' }));
  app.get('/health', (_req, res) => res.send('Server is running!'));
  app.use('/api/auth', authRouter(config));
  app.use('/api/tasks', taskRouter(config));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
