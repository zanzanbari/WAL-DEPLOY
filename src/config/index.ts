import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT as string, 10),

  /**
   * DB config
   */
  database: {
    development: {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      db: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
    },
    test: {
    },
    production: {
    }
  },

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET as string,
  jwtAlgorithm: process.env.JWT_ALGORITHM,
  jwtAcOption: {
    issuer: process.env.JWT_ISSUER,
    expiresIn: process.env.JWT_AC_EXPIRES
  },
  jwtRfOption: {
    issuer: process.env.JWT_ISSUER,
    expiresIn: process.env.JWT_RF_EXPIRES
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * redis config
   */
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string, 10),
    password: process.env.REDIS_PASSWORD
  },

};
