import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use(requestLogger);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Import routes
  const contentRoutes = require('./routes/content.routes').default;
  const searchRoutes = require('./routes/search.routes').default;
  const processingRoutes = require('./routes/processing.routes').default;

  // API routes
  app.use('/api/content', contentRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/process', processingRoutes);

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
}
