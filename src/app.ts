import 'reflect-metadata';
import express from 'express';
import config from './config';
import logger from './loaders/logger';

async function startServer(): Promise<void> {
  const app = express();

  await require("./loaders").default({ expressApp: app })
 
  app.listen(config.port, () => {
    console.log(`
      ################################################
            🛡️  Server listening on port 🛡️
      ################################################
    `);
  })
  .on("error", (err) => {
    logger.appLogger.error(err.message);
    process.exit(1);
  });
}

startServer();