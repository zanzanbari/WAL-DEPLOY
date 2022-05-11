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
exports.mainController = void 0;
const logger_1 = __importDefault(require("../middlewares/logger"));
const models_1 = require("../../models");
const apiResponse_1 = require("../../modules/apiResponse");
const resultCode_1 = __importDefault(require("../../constant/resultCode"));
const resultMessage_1 = __importDefault(require("../../constant/resultMessage"));
const getTodayWals = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const todayWals = yield models_1.TodayWal.getTodayWalsByUserId(userId);
        const content = {};
        todayWals.forEach((wal) => {
            console.log(wal.getDataValue("time"));
            const time = wal.getDataValue("time");
            console.log(time.getHours());
        });
        /*
                const monthDate = dayjs(rawDate).format("MM. DD") as string;
                let time = dayjs(rawDate).format(":mm") as string;
                
                if (dayjs(rawDate).hour() >= 12) {
                    time = ` 오후 ${dayjs(rawDate).hour() - 12}` + time;
                } else {
                    time = ` 오전 ${dayjs(rawDate).hour()}` + time;
                }
                const day = dayArr[dayjs(rawDate).day()] as string;
        */
        const data = { content: todayWals };
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.DELETE_COMPLETED_RESERVATION_SUCCESS, data);
    }
    catch (err) {
        logger_1.default.appLogger.log({ level: "error", message: err.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(err);
    }
});
exports.mainController = {
    getTodayWals
};
//# sourceMappingURL=mainController.js.map