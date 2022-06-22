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
exports.reserveController = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const logger_1 = __importDefault(require("../../loaders/logger"));
const models_1 = require("../../models");
const apiResponse_1 = require("../../common/apiResponse");
const resultCode_1 = __importDefault(require("../../constant/resultCode"));
const resultMessage_1 = __importDefault(require("../../constant/resultMessage"));
const dayArr = ["(일)", "(월)", "(화)", "(수)", "(목)", "(금)", "(토)"];
const getHistoryDateMessage = (rawDate) => {
    try {
        const monthDate = (0, dayjs_1.default)(rawDate).format("MM. DD");
        let time = (0, dayjs_1.default)(rawDate).format(":mm");
        if ((0, dayjs_1.default)(rawDate).hour() >= 12) {
            time = ` 오후 ${(0, dayjs_1.default)(rawDate).hour() - 12}` + time;
        }
        else {
            time = ` 오전 ${(0, dayjs_1.default)(rawDate).hour()}` + time;
        }
        const day = dayArr[(0, dayjs_1.default)(rawDate).day()];
        return {
            monthDate,
            day,
            time
        };
    }
    catch (err) {
        logger_1.default.appLogger.log({ level: "error", message: err.message });
    }
};
const pushEachItems = (Items, DataArr, completed) => {
    try {
        for (const item of Items) {
            const rawDate = item.getDataValue("sendingDate");
            const historyMessage = getHistoryDateMessage(rawDate);
            const sendingDate = (historyMessage === null || historyMessage === void 0 ? void 0 : historyMessage.monthDate) + " " + (historyMessage === null || historyMessage === void 0 ? void 0 : historyMessage.day) + (historyMessage === null || historyMessage === void 0 ? void 0 : historyMessage.time) + (!completed ? " • 전송 예정" : " • 전송 완료");
            DataArr.push(Object.assign({ postId: item.id, sendingDate, content: item.getDataValue("content"), reservedAt: (0, dayjs_1.default)(item.getDataValue("reservedAt")).format("YYYY. MM. DD") }, (!completed && { hidden: item.getDataValue("hide") }) //!completed인 경우에만 obj에 hidden속성이 들어감
            ));
        }
    }
    catch (err) {
        logger_1.default.appLogger.log({ level: "error", message: err.message });
    }
};
const getReservation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const sendingData = [], completeData = [];
        const data = {
            sendingData,
            completeData
        };
        const sendingDataItems = yield models_1.Reservation.getSendingItems((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const completeDataItems = yield models_1.Reservation.getCompletedItems((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (sendingDataItems.length < 1 && completeDataItems.length < 1) {
            return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.NO_RESERVATION, data);
        }
        pushEachItems(sendingDataItems, sendingData, false);
        pushEachItems(completeDataItems, completeData, true);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.READ_RESERVATIONS_SUCCESS, data);
    }
    catch (err) {
        logger_1.default.appLogger.log({ level: "error", message: err.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(err);
    }
});
const postReservation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { content, hide, date, time } = req.body;
        if (!content || hide == undefined || !date || !time)
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.NULL_VALUE);
        const existingDate = yield models_1.Reservation.getReservationByDate((_c = req.user) === null || _c === void 0 ? void 0 : _c.id, date);
        if (existingDate)
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.INVALID_RESERVATION_DATE);
        const newReservationId = yield models_1.Reservation.postReservation((_d = req.user) === null || _d === void 0 ? void 0 : _d.id, date, time, hide, content);
        const data = { postId: newReservationId };
        /**
         * -----------------------------알림 보내는 기능 넣어야 한다 ---------------------------
         *
         */
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.ADD_RESERVATION_SUCCESS, data);
    }
    catch (err) {
        logger_1.default.appLogger.log({ level: "error", message: err.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(err);
    }
});
const getReservedDate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const date = [];
        const data = { date };
        const reservedDateItems = yield models_1.Reservation.getReservationsFromTomorrow((_e = req.user) === null || _e === void 0 ? void 0 : _e.id);
        if (reservedDateItems.length < 1) {
            return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.NO_RESERVATION_DATE, data);
        }
        for (const item of reservedDateItems) {
            const reservedDate = item.getDataValue("sendingDate");
            date.push((0, dayjs_1.default)(reservedDate).format("YYYY-MM-DD"));
        }
        data.date = date.sort();
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.READ_RESERVED_DATE_SUCCESS, data);
    }
    catch (err) {
        logger_1.default.appLogger.log({ level: "error", message: err.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(err);
    }
});
const deleteReservation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const postId = req.params.postId;
    if (postId == ":postId")
        return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.WRONG_PARAMS_OR_NULL);
    try {
        const waitingReservation = yield models_1.Reservation.getReservationByPostId(parseInt(postId), (_f = req.user) === null || _f === void 0 ? void 0 : _f.id, false);
        if (!waitingReservation)
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.NOT_FOUND, resultMessage_1.default.NO_OR_COMPLETED_RESERVATION);
        /**
         * -------------------------------
            schedule에서 해당 reservation 삭제!!!!!!!!!!!!!!!!!
            -------------------------------
        **/
        yield (waitingReservation === null || waitingReservation === void 0 ? void 0 : waitingReservation.destroy());
        const data = { postId: parseInt(postId) };
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.DELETE_RESERVATION_SUCCESS, data);
    }
    catch (err) {
        logger_1.default.appLogger.log({ level: "error", message: err.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(err);
    }
});
const deleteCompletedReservation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const postId = req.params.postId;
    if (postId == ":postId")
        return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.WRONG_PARAMS_OR_NULL);
    try {
        const completedReservation = yield models_1.Reservation.getReservationByPostId(parseInt(postId), (_g = req.user) === null || _g === void 0 ? void 0 : _g.id, true);
        if (!completedReservation)
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.NOT_FOUND, resultMessage_1.default.NO_OR_UNCOMPLETED_RESERVATION);
        yield (completedReservation === null || completedReservation === void 0 ? void 0 : completedReservation.destroy());
        const data = { postId: parseInt(postId) };
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.DELETE_COMPLETED_RESERVATION_SUCCESS, data);
    }
    catch (err) {
        logger_1.default.appLogger.log({ level: "error", message: err.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(err);
    }
});
exports.reserveController = {
    getReservation,
    postReservation,
    getReservedDate,
    deleteReservation,
    deleteCompletedReservation
};
//# sourceMappingURL=reserveController.js.map