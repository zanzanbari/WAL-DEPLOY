"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const globalService_1 = __importDefault(require("../services/globalService"));
const models_1 = require("../models");
const globalServiceInstance = new globalService_1.default(models_1.UserCategory, models_1.Item, models_1.TodayWal, models_1.User, models_1.Time, models_1.Subtitle, models_1.TodaySubtitle, logger_1.default);
exports.default = globalServiceInstance;
//# sourceMappingURL=initWal.js.map