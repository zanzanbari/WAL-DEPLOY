"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv_1.default.config();
if (envFound.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
exports.default = {
    /**
     * My favorite port
     */
    port: parseInt(process.env.PORT, 10),
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
        test: {},
        production: {}
    },
    /**
     * Your secret sauce
     */
    jwtSecret: process.env.JWT_SECRET,
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
     * redis config
     */
    redis: {
        dev: {
            host: "localhost",
            port: 6379
        },
        production: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
            password: process.env.REDIS_PASSWORD
        }
    },
};
//# sourceMappingURL=index.js.map