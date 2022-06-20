import logger from "./logger";
import expressLoader from "./express";
import dbSequelizeLoader from "./dbSequelize";
import globalInstance from "./initWal";

export default async ({ expressApp }) => {

  globalInstance.updateAtNoonEveryDay();

  await dbSequelizeLoader();
  logger.appLogger.info("🚀 DB Loaded And Connected");

  await expressLoader({ app: expressApp });
  logger.appLogger.info("✅ Express Loaded");

}