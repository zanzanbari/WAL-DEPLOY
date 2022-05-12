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
const getMainResponse = (todayWals) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todayWal = [];
        for (const wal of todayWals) {
            let type, content, canOpen;
            if (wal.getDataValue("userDefined")) { //직접 추가한 예약이라면
                type = "스페셜";
                const reservationId = wal.getDataValue("reservation_id");
                const reservation = yield models_1.Reservation.getReservationById(reservationId);
                content = reservation === null || reservation === void 0 ? void 0 : reservation.content;
                const time = wal.getDataValue("time");
                canOpen = new Date() >= time ? true : false;
            }
            else {
                const time = wal.getDataValue("time");
                if (time.getHours() == 8)
                    type = "아침";
                else if (time.getHours() == 14)
                    type = "점심";
                else
                    type = "저녁";
                const itemId = wal.getDataValue("item_id");
                const item = yield models_1.Item.getItemById(itemId);
                content = item === null || item === void 0 ? void 0 : item.content;
                canOpen = new Date() >= time ? true : false;
            }
            todayWal.push({
                type,
                content,
                canOpen
            });
        }
        return todayWal;
    }
    catch (err) {
        logger_1.default.appLogger.log({ level: "error", message: err.message });
    }
});
const getTodayWals = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const todayWals = yield models_1.TodayWal.getTodayWalsByUserId(userId);
        const todayWal = yield getMainResponse(todayWals);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.READ_TODAY_WAL_SUCCESS, { todayWal });
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