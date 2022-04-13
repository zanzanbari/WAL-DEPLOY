"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comfort = exports.Blame = exports.Fuss = exports.Drip = exports.Reservation = exports.Time = exports.Message = exports.Category = exports.User = void 0;
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const sequelize_typescript_1 = require("sequelize-typescript");
const users_1 = __importDefault(require("./users"));
exports.User = users_1.default;
const categories_1 = __importDefault(require("./categories"));
exports.Category = categories_1.default;
const messages_1 = __importDefault(require("./messages"));
exports.Message = messages_1.default;
const times_1 = __importDefault(require("./times"));
exports.Time = times_1.default;
const reservations_1 = __importDefault(require("./reservations"));
exports.Reservation = reservations_1.default;
const drips_1 = __importDefault(require("./drips"));
exports.Drip = drips_1.default;
const fusses_1 = __importDefault(require("./fusses"));
exports.Fuss = fusses_1.default;
const blames_1 = __importDefault(require("./blames"));
exports.Blame = blames_1.default;
const comforts_1 = __importDefault(require("./comforts"));
exports.Comfort = comforts_1.default;
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
    messages_1.default,
    times_1.default,
    reservations_1.default,
    drips_1.default,
    fusses_1.default,
    blames_1.default,
    comforts_1.default
]);
exports.default = sequelize;
//# sourceMappingURL=index.js.map