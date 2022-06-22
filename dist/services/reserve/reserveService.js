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
const dayjs_1 = __importDefault(require("dayjs"));
const timeHandler_1 = __importDefault(require("../../common/timeHandler"));
class ReserveService {
    constructor(reserveRepository, todayWalRepository, timeQueueEvent, logger) {
        this.reserveRepository = reserveRepository;
        this.todayWalRepository = todayWalRepository;
        this.timeQueueEvent = timeQueueEvent;
        this.logger = logger;
    }
    /**
    *  @desc 예약한_왈소리_히스토리
    *  @route GET /reserve
    *  @access public
    */
    getReservation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sendingData = [];
                const completeData = [];
                const beforeSendItems = yield this.reserveRepository.getSendingItems(userId);
                const alreadySendItems = yield this.reserveRepository.getCompletedItems(userId);
                ;
                if (beforeSendItems.length < 1 && alreadySendItems.length < 1)
                    return "NO_RESERVATION";
                yield this.pushEachItems(sendingData, beforeSendItems, false);
                yield this.pushEachItems(completeData, alreadySendItems, true);
                return { sendingData, completeData };
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    /**
     *  @desc 왈소리_만들기
     *  @route POST /reserve
     *  @access public
     */
    postReservation(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingDate = yield this.reserveRepository.getReservationByDate(userId, request.date);
                if (existingDate)
                    return 19 /* customError.ALREADY_RESERVED_DATE */;
                const newReservationId = yield this.reserveRepository.setReservation(userId, request);
                if (request.date == timeHandler_1.default.getCurrentDate()) { // 예약한게 오늘 날짜면
                    const data = {
                        userId,
                        reservationId: newReservationId,
                        time: new Date(`${request.date} ${request.time}`),
                        userDefined: true
                    };
                    yield this.todayWalRepository.setTodayWal(data);
                }
                // 예약 큐에 추가
                yield this.timeQueueEvent.emit("addReservationQueue", userId, request.date, request.time);
                return { postId: newReservationId };
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    /**
     *  @desc 예약한_왈소리_날짜_확인
     *  @route GET /reserve/datepicker
     *  @access public
     */
    getReservationOnCalender(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservedDateItems = yield this.reserveRepository.getReservationsFromTomorrow(userId);
                if (reservedDateItems.length < 1)
                    return "NO_RESERVATION_DATE";
                const date = [];
                for (const item of reservedDateItems) {
                    const reservedDate = item.getDataValue("sendingDate");
                    date.push((0, dayjs_1.default)(reservedDate).format("YYYY-MM-DD"));
                }
                return date.sort();
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    /**
     *  @desc 왈소리_예약_취소
     *  @route DELETE /reserve/:postId
     *  @access public
     */
    removeReservation(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 대기중인 예약 왈소리 가져오기
                const waitingReservation = yield this.reserveRepository.getReservationByPostId(userId, postId, false);
                if (!waitingReservation)
                    return 20 /* customError.NO_OR_COMPLETED_RESERVATION */;
                // 예약 큐에서 제거
                yield this.timeQueueEvent.emit("cancelReservationQueue", userId, waitingReservation.sendingDate);
                // 오늘의 왈소리에서 제거, 예약에서도 제거
                const isReserved = yield this.todayWalRepository.getTodayReservation(userId, postId);
                if (isReserved)
                    yield (isReserved === null || isReserved === void 0 ? void 0 : isReserved.destroy());
                yield waitingReservation.destroy();
                return { postId };
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    /**
     *  @desc 전송된_왈소리_히스토리_삭제
     *  @route DELETE /reserve/completed/:postId
     *  @access public
     */
    removeReservationHistory(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const completedReservation = yield this.reserveRepository.getReservationByPostId(userId, postId, true);
                if (!completedReservation)
                    return 21 /* customError.NO_OR_UNCOMPLETED_RESERVATION */;
                // 오늘의 왈소리에서 제거, 예약에서도 제거
                const isReserved = yield this.todayWalRepository.getTodayReservation(userId, postId);
                if (isReserved)
                    yield (isReserved === null || isReserved === void 0 ? void 0 : isReserved.destroy());
                yield completedReservation.destroy();
                return { postId };
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    /**
     * -------------------------
     *  @access private Method
     * -------------------------
     */
    getHistoryDateMessage(rawDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = (0, dayjs_1.default)(rawDate);
                const monthDate = date.format("MM. DD");
                let time = date.format(":mm");
                if (date.hour() > 12) {
                    time = ` 오후 ${date.hour() - 12}` + time;
                }
                else {
                    time = ` 오전 ${date.hour()}` + time;
                }
                const dayOfWeek = ["(일)", "(월)", "(화)", "(수)", "(목)", "(금)", "(토)"];
                const day = dayOfWeek[date.day()];
                return { monthDate, day, time };
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    pushEachItems(dataArr, Items, completed) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const item of Items) {
                    const rowDate = item.getDataValue("sendingDate");
                    const historyMessage = yield this.getHistoryDateMessage(rowDate);
                    const sendingDate = historyMessage.monthDate + " " +
                        historyMessage.day +
                        historyMessage.time +
                        (!completed ? " • 전송 예정" : " • 전송 완료");
                    const reserveData = Object.assign({ postId: item.id, sendingDate, content: item.getDataValue("content"), reserveAt: (0, dayjs_1.default)(item.getDataValue("reserveAt")).format("YYYY. MM. DD") }, (!completed && { hidden: item.getDataValue("hide") }));
                    dataArr.push(reserveData);
                }
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
}
exports.default = ReserveService;
//# sourceMappingURL=reserveService.js.map