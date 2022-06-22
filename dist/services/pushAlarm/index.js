"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reserveQueue = exports.messageQueue = exports.nightQueue = exports.afternoonQueue = exports.morningQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const config_1 = __importDefault(require("../../config"));
exports.morningQueue = new bull_1.default('morning-queue', {
    redis: config_1.default.redis.production
});
exports.afternoonQueue = new bull_1.default('afternoon-queue', {
    redis: config_1.default.redis.production
});
exports.nightQueue = new bull_1.default('night-queue', {
    redis: config_1.default.redis.production
});
exports.messageQueue = new bull_1.default('message-queue', {
    redis: config_1.default.redis.production,
    defaultJobOptions: {
        removeOnComplete: true //job 완료 시 삭제
    }
});
exports.reserveQueue = new bull_1.default("reserve-queue", {
    redis: config_1.default.redis.production,
    defaultJobOptions: {
        removeOnComplete: true
    }
});
//# sourceMappingURL=index.js.map