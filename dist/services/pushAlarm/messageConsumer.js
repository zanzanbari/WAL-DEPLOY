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
exports.messageProcess = void 0;
const logger_1 = __importDefault(require("../../loaders/logger"));
const models_1 = require("../../models");
const firebase_1 = require("../../loaders/firebase");
const messageProcess = (job, done) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.appLogger.log({ level: "info", message: "message queue process START" });
    try {
        const { fcmtoken, content, isReserved } = job.data;
        const message = {
            notification: {
                title: '왈',
                body: content,
            },
            token: fcmtoken,
        };
        firebase_1.firebaseApp
            .messaging()
            .send(message)
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.default.appLogger.log({
                level: 'info',
                message: `📣 Successfully sent message: : ${response} ${content} ${job.id}`
            });
            if (isReserved) {
                yield models_1.Reservation.update({
                    completed: true
                }, {
                    where: { content }
                });
                logger_1.default.appLogger.log({ level: "info", message: "예약 왈소리 전송완료" });
            }
        }))
            .catch(error => {
            logger_1.default.appLogger.log({
                level: 'error',
                message: `❌ SENDING MESSAGE ERROR :: ${error.message}`
            });
        });
        done();
    }
    catch (error) {
        logger_1.default.appLogger.log({ level: "error", message: error.message });
    }
});
exports.messageProcess = messageProcess;
//# sourceMappingURL=messageConsumer.js.map