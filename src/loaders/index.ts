import logger from "./logger";
import expressLoader from "./express";
import dbSequelizeLoader from "./dbSequelize";
import { updateToday } from "../services/pushAlarm";

export default async ({ expressApp }) => {

  updateToday(); //자정마다 todayWal 업데이트

  await dbSequelizeLoader();
  logger.appLogger.info("🚀 DB Loaded And Connected");

  await expressLoader({ app: expressApp });
  logger.appLogger.info("✅ Express Loaded");

}