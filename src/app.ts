import 'reflect-metadata';
import express from 'express';
import config from './config';
import logger from './loaders/logger';

async function startServer(): Promise<void> {
  const app = express();

  await require("./loaders").default({ expressApp: app })
 
  app.listen(config.port, () => {
    logger.appLogger.log({
      level: "info",
      message: `
        ################################################
<<<<<<< HEAD
              🛡️  Server listening on port 🛡️
=======
                🛡️  Server listening on port 🛡️
>>>>>>> develop
        ################################################
    `});
  })
  .on("error", (err) => {
    logger.appLogger.error(err.message);
    process.exit(1);
  });
}

startServer();