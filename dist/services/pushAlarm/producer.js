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
const timeHandler_1 = __importDefault(require("../../common/timeHandler"));
class Producer {
    constructor(morningQueue, afternoonQueue, nightQueue, reserveQueue, processEvent, logger) {
        this.morningQueue = morningQueue;
        this.afternoonQueue = afternoonQueue;
        this.nightQueue = nightQueue;
        this.reserveQueue = reserveQueue;
        this.processEvent = processEvent;
        this.logger = logger;
    }
    /**
     *  @desc 유저가 설정한 시간대에 큐 추가
     *  @access public
     */
    addTimeQueue(userId, time) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (time.morning)
                    this.addQueueAndEmitConsumer(`morning ${userId}`, userId);
                if (time.afternoon)
                    this.addQueueAndEmitConsumer(`afternoon ${userId}`, userId);
                if (time.night)
                    this.addQueueAndEmitConsumer(`night ${userId}`, userId);
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
            }
        });
    }
    /**
     *  @desc 유저가 설정 시간 추가 변경 했을 때 해당 시간 큐에 추가
     *  @access public
     */
    updateAddTimeQueue(userId, time) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (time.getTime() == timeHandler_1.default.getMorning().getTime())
                    this.addQueueAndEmitConsumer(`morning ${userId}`, userId);
                if (time.getTime() == timeHandler_1.default.getAfternoon().getTime())
                    this.addQueueAndEmitConsumer(`afternoon ${userId}`, userId);
                if (time.getTime() == timeHandler_1.default.getNight().getTime())
                    this.addQueueAndEmitConsumer(`night ${userId}`, userId);
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
            }
        });
    }
    /**
     *  @desc 유저가 설정 시간 삭제 변경 했을 때 해당 시간 큐에서 제거
     *  @access public
     */
    updateCancelTimeQueue(userId, time) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (time.getTime() == timeHandler_1.default.getMorning().getTime()) {
                    yield this.morningQueue.removeRepeatable(`morning ${userId}`, {
                        cron: "0 0 8 * * *",
                        jobId: userId
                    });
                    this.logger.appLogger.log({ level: "info", message: `유저 ${userId} :: morningQueue 삭제 성공` });
                }
                if (time.getTime() == timeHandler_1.default.getAfternoon().getTime()) {
                    yield this.afternoonQueue.removeRepeatable(`afternoon ${userId}`, {
                        cron: "0 0 14 * * *",
                        jobId: userId
                    });
                    this.logger.appLogger.log({ level: "info", message: `유저 ${userId} :: afternoonQueue 삭제 성공` });
                }
                if (time.getTime() == timeHandler_1.default.getNight().getTime()) {
                    yield this.nightQueue.removeRepeatable(`night ${userId}`, {
                        cron: "0 0 20 * * *",
                        jobId: userId
                    });
                    this.logger.appLogger.log({ level: "info", message: `유저 ${userId} :: nightQueue 삭제 성공` });
                }
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
            }
        });
    }
    /**
     *  @desc 예약 큐 추가
     *  @date 2022-06-21 형식
     *  @time 20:30:00 형식
     *  @access public
     */
    addReservationQueue(userId, date, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const sepDate = date.split("-");
            const month = this.removeZero(sepDate[1]);
            const day = this.removeZero(sepDate[2]);
            const sepTime = time.split(":");
            const hour = this.removeZero(sepTime[0]);
            const min = this.removeZero(sepTime[1]);
            try {
                yield this.reserveQueue.add(`reserve ${userId}`, userId, {
                    jobId: userId,
                    repeat: { cron: `0 ${min} ${hour} ${day} ${month} *` },
                    removeOnComplete: true
                });
                this.logger.appLogger.log({ level: "info", message: `유저 ${userId} :: reserveQueue 등록 성공` });
                this.processEvent.emit("reserveProcess", userId);
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
            }
        });
    }
    /**
     *  @desc 예약 큐 제거
     *  @date 2022-06-21T20:00:00.0000Z 형식
     *  @access public
     */
    cancelReservationQueue(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const utcDate = timeHandler_1.default.toUtcTime(date);
            const strDate = utcDate.toISOString().split("T");
            const sepDate = strDate[0];
            const month = this.removeZero(sepDate.split("-")[1]);
            const day = this.removeZero(sepDate.split("-")[2]);
            const sepTime = strDate[1];
            const hour = this.removeZero(sepTime.split(":")[0]);
            const min = this.removeZero(sepTime.split(":")[1]);
            try {
                yield this.reserveQueue.removeRepeatable(`reserve ${userId}`, {
                    cron: `0 ${min} ${hour} ${day} ${month} *`,
                    jobId: userId
                });
                this.logger.appLogger.log({ level: "info", message: `유저 ${userId} :: reserveQueue 삭제 성공` });
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
            }
        });
    }
    /**
     *  @desc 큐 추가 및 process 이벤트 emit
     *  @access private
     */
    addQueueAndEmitConsumer(time, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (time) {
                    case `morning ${userId}`:
                        yield this.morningQueue.add(`morning ${userId}`, userId, {
                            jobId: userId,
                            repeat: { cron: "0 0 8 * * *" }
                        });
                        this.logger.appLogger.log({ level: "info", message: `유저 ${userId} :: morningQueue 등록 성공` });
                        this.processEvent.emit("morningProcess", userId);
                        break;
                    case `afternoon ${userId}`:
                        yield this.afternoonQueue.add(`afternoon ${userId}`, userId, {
                            jobId: userId,
                            repeat: { cron: "0 0 14 * * *" }
                        });
                        this.logger.appLogger.log({ level: "info", message: `유저 ${userId} :: afternoonQueue 등록 성공` });
                        this.processEvent.emit("afternoonProcess", userId);
                        break;
                    case `night ${userId}`:
                        yield this.nightQueue.add(`night ${userId}`, userId, {
                            jobId: userId,
                            repeat: { cron: "0 0 20 * * *" }
                        });
                        this.logger.appLogger.log({ level: "info", message: `유저 ${userId} :: nightQueue 등록 성공` });
                        this.processEvent.emit("nightProcess", userId);
                        break;
                }
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
            }
        });
    }
    /**
     *  @desc cron 형식에 01 ~ 09 불가능하므로 0 제거
     *  @access private
     */
    removeZero(element) {
        if (element.split("")[0] === "0") {
            return element.split("")[1];
        }
        else {
            return element;
        }
    }
}
exports.default = Producer;
//# sourceMappingURL=producer.js.map