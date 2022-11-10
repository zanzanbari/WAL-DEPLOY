"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodaySubtitle = exports.Subtitle = exports.ResignUser = exports.TodayWal = exports.Reservation = exports.Time = exports.Item = exports.UserCategory = exports.Category = exports.User = void 0;
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
const todayWals_1 = __importDefault(require("./todayWals"));
exports.TodayWal = todayWals_1.default;
const config_1 = __importDefault(require("../config"));
const resignUsers_1 = __importDefault(require("./resignUsers"));
exports.ResignUser = resignUsers_1.default;
const subtitle_1 = __importDefault(require("./subtitle"));
exports.Subtitle = subtitle_1.default;
const todaySubtitle_1 = __importDefault(require("./todaySubtitle"));
exports.TodaySubtitle = todaySubtitle_1.default;
const sequelize = new sequelize_typescript_1.Sequelize({
    host: config_1.default.database.development.host,
    database: config_1.default.database.development.db,
    username: config_1.default.database.development.username,
    password: config_1.default.database.development.password,
    dialect: "postgres",
    logging: false,
    timezone: "+09:00",
    dialectOptions: {
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: true
    }
});
sequelize.addModels([
    users_1.default,
    categories_1.default,
    userCategories_1.default,
    items_1.default,
    times_1.default,
    reservations_1.default,
    todayWals_1.default,
    resignUsers_1.default,
    subtitle_1.default,
    todaySubtitle_1.default
]);
exports.default = sequelize;
//# sourceMappingURL=index.js.map