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
exports.updateUserTime = exports.addUserTime = void 0;
const _1 = require("./");
const consumer_1 = require("./consumer");
const models_1 = require("../../models");
const logger_1 = __importDefault(require("../../loaders/logger"));
const timeHandler_1 = __importDefault(require("../../common/timeHandler"));
/**
*  @시간정보_큐에_추가
*  @desc
*  @flag_0 : morning
*  @flag_1 : afternoon
*  @flag_2 : night
*/
function addTimeQueue(userId, flag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            switch (flag) {
                case 0:
                    yield _1.morningQueue.add("morning", userId, {
                        jobId: userId,
                        repeat: { cron: `0 0 8 * * *` }
                    });
                    logger_1.default.appLogger.log({ level: "info", message: `유저 ${userId} :: morningQueue 등록 성공` });
                    _1.morningQueue.process("morning", consumer_1.morningFunc);
                    break;
                case 1:
                    yield _1.afternoonQueue.add("afternoon", userId, {
                        jobId: userId,
                        repeat: { cron: `0 0 14 * * *` }
                    });
                    logger_1.default.appLogger.log({ level: "info", message: `유저 ${userId} :: afternoonQueue 등록 성공` });
                    _1.afternoonQueue.process("afternoon", consumer_1.afterFunc);
                    break;
                case 2:
                    yield _1.nightQueue.add("night", userId, {
                        jobId: userId,
                        repeat: { cron: `0 0 18 * * *` }
                    });
                    logger_1.default.appLogger.log({ level: "info", message: `유저 ${userId} :: nightQueue 등록 성공` });
                    _1.nightQueue.process("night", consumer_1.nightFunc);
                    break;
            }
        }
        catch (error) {
            logger_1.default.appLogger.log({ level: "error", message: error.message });
            throw error;
        }
    });
}
function addUserTime(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //user id를 data로 전달
            const times = yield models_1.Time.findOne({
                where: { user_id: userId }
            });
            if (times.morning)
                addTimeQueue(userId, 0);
            if (times.afternoon)
                addTimeQueue(userId, 1);
            if (times.night)
                addTimeQueue(userId, 2);
        }
        catch (error) {
            logger_1.default.appLogger.log({ level: "error", message: error.message });
            throw error;
        }
    });
}
exports.addUserTime = addUserTime;
//user 세팅 수정 시 특정 조건에 걸리면 이 함수 실행
function updateUserTime(userId, time, flag) {
    return __awaiter(this, void 0, void 0, function* () {
        //time: morning, afternoon, night
        //flag: add, delete
        try {
            if (flag == "add") {
                if (time == timeHandler_1.default.getMorning())
                    addTimeQueue(userId, 0);
                if (time == timeHandler_1.default.getAfternoon())
                    addTimeQueue(userId, 1);
                if (time == timeHandler_1.default.getNight())
                    addTimeQueue(userId, 2);
            }
            else if (flag == "cancel") {
                if (time == timeHandler_1.default.getMorning()) {
                    yield (_1.morningQueue === null || _1.morningQueue === void 0 ? void 0 : _1.morningQueue.removeRepeatable("morning", { cron: `* 8 * * *`, jobId: userId }));
                }
                else if (time == timeHandler_1.default.getAfternoon()) {
                    yield (_1.afternoonQueue === null || _1.afternoonQueue === void 0 ? void 0 : _1.afternoonQueue.removeRepeatable("afternoon", { cron: `* 14 * * *`, jobId: userId }));
                }
                else if (time == timeHandler_1.default.getNight()) {
                    yield (_1.nightQueue === null || _1.nightQueue === void 0 ? void 0 : _1.nightQueue.removeRepeatable("night", { cron: `* 20 * * *`, jobId: userId }));
                }
            }
        }
        catch (error) {
            logger_1.default.appLogger.log({ level: "error", message: error.message });
            throw error;
        }
    });
}
exports.updateUserTime = updateUserTime;
//# sourceMappingURL=producer.js.map