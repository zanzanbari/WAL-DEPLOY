"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const _1 = require(".");
const consumer_1 = require("./consumer");
const producer_1 = __importDefault(require("./producer"));
const logger_1 = __importDefault(require("../../loaders/logger"));
const queueEvent = new events_1.default();
const processEvent = new events_1.default();
/**
 *  @Producer
 *  @desc 큐 추가 or 삭제 이벤트
 *  @access user 초기 설정, 시간대 변경 설정 에서 실행
 */
queueEvent.on("addTimeQueue", (userId, time) => {
    const producerInstance = new producer_1.default(_1.morningQueue, _1.afternoonQueue, _1.nightQueue, _1.reserveQueue, processEvent, logger_1.default);
    producerInstance.addTimeQueue(userId, time);
});
queueEvent.on("updateAddTimeQueue", (userId, time) => {
    const producerInstance = new producer_1.default(_1.morningQueue, _1.afternoonQueue, _1.nightQueue, _1.reserveQueue, processEvent, logger_1.default);
    producerInstance.updateAddTimeQueue(userId, time);
});
queueEvent.on("updateCancelTimeQueue", (userId, time) => {
    const producerInstance = new producer_1.default(_1.morningQueue, _1.afternoonQueue, _1.nightQueue, _1.reserveQueue, processEvent, logger_1.default);
    producerInstance.updateCancelTimeQueue(userId, time);
});
queueEvent.on("addReservationQueue", (userId, date, time) => {
    const producerInstance = new producer_1.default(_1.morningQueue, _1.afternoonQueue, _1.nightQueue, _1.reserveQueue, processEvent, logger_1.default);
    producerInstance.addReservationQueue(userId, date, time);
});
queueEvent.on("cancelReservationQueue", (userId, date) => {
    const producerInstance = new producer_1.default(_1.morningQueue, _1.afternoonQueue, _1.nightQueue, _1.reserveQueue, processEvent, logger_1.default);
    producerInstance.cancelReservationQueue(userId, date);
});
/**
 *  @Consumer
 *  @desc 큐 process 이벤트
 *  @access producer 에서 실행
 */
processEvent.on("morningProcess", (userId) => {
    _1.morningQueue.process(`morning ${userId}`, consumer_1.morningProcess);
});
processEvent.on("afternoonProcess", (userId) => {
    _1.afternoonQueue.process(`afternoon ${userId}`, consumer_1.afterProcess);
});
processEvent.on("nightProcess", (userId) => {
    _1.nightQueue.process(`night ${userId}`, consumer_1.nightProcess);
});
processEvent.on("reserveProcess", (userId) => {
    _1.reserveQueue.process(`reserve ${userId}`, consumer_1.reserveProcess);
});
exports.default = queueEvent;
//# sourceMappingURL=event.js.map