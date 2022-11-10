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
const models_1 = require("../../models");
const logger_1 = __importDefault(require("../../loaders/logger"));
const resultCode_1 = __importDefault(require("../../constant/resultCode"));
const resultMessage_1 = __importDefault(require("../../constant/resultMessage"));
const event_1 = __importDefault(require("../../services/pushAlarm/event"));
const reserveService_1 = __importDefault(require("../../services/reserve/reserveService"));
const apiResponse_1 = require("../../common/apiResponse");
/**
 *  @예약한_왈소리_히스토리
 *  @route GET /reserve
 *  @access public
 */
const getReservation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const reserveServiceInstance = new reserveService_1.default(models_1.Reservation, models_1.TodayWal, event_1.default, logger_1.default);
        const data = yield reserveServiceInstance.getReservation((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (data == "NO_RESERVATION") {
            return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.NO_RESERVATION, []);
        }
        else {
            return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.READ_RESERVATIONS_SUCCESS, data);
        }
    }
    catch (error) {
        logger_1.default.appLogger.log({ level: "error", message: error.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @왈소리_만들기
 *  @route POST /reserve
 *  @access public
 */
const postReservation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const reserveServiceInstance = new reserveService_1.default(models_1.Reservation, models_1.TodayWal, event_1.default, logger_1.default);
        const data = yield reserveServiceInstance.postReservation((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, req.body);
        if (data == 19 /* ALREADY_RESERVED_DATE */) {
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.ALREADY_RESERVED_DATE);
        }
        else {
            return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.ADD_RESERVATION_SUCCESS, data);
        }
    }
    catch (error) {
        logger_1.default.appLogger.log({ level: "error", message: error.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @예약한_왈소리_날짜_확인
 *  @route GET /reserve/datepicker
 *  @access public
 */
const getReservedDate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const reserveServiceInstance = new reserveService_1.default(models_1.Reservation, models_1.TodayWal, event_1.default, logger_1.default);
        const data = yield reserveServiceInstance.getReservationOnCalender((_c = req.user) === null || _c === void 0 ? void 0 : _c.id);
        if (data == "NO_RESERVATION_DATE") {
            return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.NO_RESERVATION_DATE, []);
        }
        else {
            return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.READ_RESERVED_DATE_SUCCESS, data);
        }
    }
    catch (error) {
        logger_1.default.appLogger.log({ level: "error", message: error.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @왈소리_예약_취소
 *  @route DELETE /reserve/:postId
 *  @access public
 */
const deleteReservation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { postId } = req.params;
    if (postId == ":postId") {
        return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.WRONG_PARAMS_OR_NULL);
    }
    try {
        const reserveServiceInstance = new reserveService_1.default(models_1.Reservation, models_1.TodayWal, event_1.default, logger_1.default);
        const data = yield reserveServiceInstance.removeReservation((_d = req.user) === null || _d === void 0 ? void 0 : _d.id, parseInt(postId));
        if (data == 20 /* NO_OR_COMPLETED_RESERVATION */) {
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.NOT_FOUND, resultMessage_1.default.NO_OR_COMPLETED_RESERVATION);
        }
        else {
            return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.DELETE_RESERVATION_SUCCESS, data);
        }
    }
    catch (error) {
        logger_1.default.appLogger.log({ level: "error", message: error.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @전송된_왈소리_히스토리_삭제
 *  @route DELETE /reserve/completed/:postId
 *  @access public
 */
const deleteCompletedReservation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { postId } = req.params;
    if (postId == ":postId") {
        return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.WRONG_PARAMS_OR_NULL);
    }
    try {
        const reserveServiceInstance = new reserveService_1.default(models_1.Reservation, models_1.TodayWal, event_1.default, logger_1.default);
        const data = yield reserveServiceInstance.removeReservationHistory((_e = req.user) === null || _e === void 0 ? void 0 : _e.id, parseInt(postId));
        if (data == 21 /* NO_OR_UNCOMPLETED_RESERVATION */) {
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.NOT_FOUND, resultMessage_1.default.NO_OR_UNCOMPLETED_RESERVATION);
        }
        else {
            return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.DELETE_COMPLETED_RESERVATION_SUCCESS, data);
        }
    }
    catch (error) {
        logger_1.default.appLogger.log({ level: "error", message: error.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
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