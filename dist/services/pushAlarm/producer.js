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
const logger_1 = __importDefault(require("../../api/middlewares/logger"));
function addTimeQueue(userId, flag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            switch (flag) {
                case 0:
                    yield _1.morningQueue.add(userId, {
                        jobId: userId,
                        repeat: { cron: `* 8 * * *` }
                    });
                    yield _1.morningQueue.process(consumer_1.morningFunc);
                    break;
                case 1:
                    yield _1.afternoonQueue.add(userId, {
                        jobId: userId,
                        repeat: { cron: `* 14 * * *` }
                    });
                    yield _1.afternoonQueue.process(consumer_1.afterFunc);
                    break;
                case 2:
                    yield _1.nightQueue.add(userId, {
                        jobId: userId,
                        repeat: { cron: `* 20 * * *` }
                    });
                    yield _1.nightQueue.process(consumer_1.nightFunc);
                    break;
            }
        }
        catch (err) {
            logger_1.default.appLogger.log({ level: "error", message: err.message });
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
            if (times.morning) {
                addTimeQueue(userId, 0);
            }
            if (times.afternoon) {
                addTimeQueue(userId, 1);
            }
            if (times.night) {
                addTimeQueue(userId, 2);
            }
        }
        catch (err) {
            logger_1.default.appLogger.log({ level: "error", message: err.message });
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
                if (time == "morning") {
                    yield addTimeQueue(userId, 0);
                }
                else if (time == "afternoon") {
                    yield addTimeQueue(userId, 1);
                }
                else if (time == "night") {
                    yield addTimeQueue(userId, 2);
                }
            }
            else {
                if (time == "morning") {
                    yield (_1.morningQueue === null || _1.morningQueue === void 0 ? void 0 : _1.morningQueue.removeRepeatable("__default__", { cron: `* 8 * * *`, jobId: userId }));
                }
                else if (time == "afternoon") {
                    yield (_1.afternoonQueue === null || _1.afternoonQueue === void 0 ? void 0 : _1.afternoonQueue.removeRepeatable("__default__", { cron: `* 14 * * *`, jobId: userId }));
                }
                else if (time == "night") {
                    yield (_1.nightQueue === null || _1.nightQueue === void 0 ? void 0 : _1.nightQueue.removeRepeatable("__default__", { cron: `* 20 * * *`, jobId: userId }));
                }
            }
        }
        catch (err) {
            logger_1.default.appLogger.log({ level: "error", message: err.message });
        }
    });
}
exports.updateUserTime = updateUserTime;
//# sourceMappingURL=producer.js.map