"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = exports.Time = exports.Item = exports.UserCategory = exports.Category = exports.User = void 0;
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const sequelize_typescript_1 = require("sequelize-typescript");
const users_1 = __importDefault(require("./users"));
exports.User = users_1.default;
const categories_1 = __importDefault(require("./categories"));
exports.Category = categories_1.default;
const items_1 = __importDefault(require("./items"));
exports.Item = items_1.default;
const times_1 = __importDefault(require("./times"));
exports.Time = times_1.default;
const reservations_1 = __importDefault(require("./reservations"));
exports.Reservation = reservations_1.default;
const userCategories_1 = __importDefault(require("./userCategories"));
exports.UserCategory = userCategories_1.default;
const sequelize = new sequelize_typescript_1.Sequelize({
    host: dbConfig_1.default.development.host,
    database: dbConfig_1.default.development.database,
    username: dbConfig_1.default.development.username,
    password: dbConfig_1.default.development.password,
    dialect: "postgres",
    logging: false,
    timezone: "+09:00",
});
sequelize.addModels([
    users_1.default,
    categories_1.default,
    userCategories_1.default,
    items_1.default,
    times_1.default,
    reservations_1.default
]);
exports.default = sequelize;
//# sourceMappingURL=index.js.map