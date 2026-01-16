import { createApp } from './app';
import { config } from './utils/config';
import { logger } from './utils/logger';
import { PrismaClient } from '@prisma/client';
import { QueueManager } from './queue/QueueManager';
import { setupQueueProcessors } from './queue/setupProcessors';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Setup queue processors
    const queueManager = new QueueManager();
    setupQueueProcessors(queueManager);
    logger.info('Queue processors setup complete');

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

main();
