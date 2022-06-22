import sequelize from "../models";
import logger from "./logger";

// 시퀄라이즈 연결
export default async () => {

  sequelize.authenticate()
    .then(async () => {
      logger.appLogger.info("✅ Connect PostgreSQL");
    })
    .catch((error) => {
      logger.appLogger.error(`❌ sequelize authenticate Error: ${error.message}`);
    });

  // 시퀄라이즈 모델 DB에 싱크
  sequelize.sync({ force: false })
    .then(() => {
      logger.appLogger.info("✅ Sync Models to DB");
    })
    .catch((error) => {
      logger.appLogger.error(`❌ DB CONNECT ERROR: ${error.message}`);
    });

}
