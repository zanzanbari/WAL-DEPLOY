"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const express_1 = __importDefault(require("./express"));
const dbSequelize_1 = __importDefault(require("./dbSequelize"));
const pushAlarm_1 = require("../services/pushAlarm");
exports.default = ({ expressApp }) => __awaiter(void 0, void 0, void 0, function* () {
    (0, pushAlarm_1.updateToday)(); //자정마다 todayWal 업데이트
    yield (0, dbSequelize_1.default)();
    logger_1.default.appLogger.info("🚀 DB Loaded And Connected");
    yield (0, express_1.default)({ app: expressApp });
    logger_1.default.appLogger.info("✅ Express Loaded");
});
//# sourceMappingURL=index.js.map