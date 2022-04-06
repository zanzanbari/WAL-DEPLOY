"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("@/config/dbConfig"));
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize = new sequelize_typescript_1.Sequelize({
    host: dbConfig_1.default.development.host,
    database: dbConfig_1.default.development.database,
    username: dbConfig_1.default.development.username,
    password: dbConfig_1.default.development.password,
    dialect: "postgres",
    logging: false,
    timezone: "+09:00",
});
sequelize.addModels([]);
exports.default = sequelize;
//# sourceMappingURL=index.js.map