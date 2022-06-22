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
exports.reserveProcess = exports.nightProcess = exports.afterProcess = exports.morningProcess = void 0;
const _1 = require(".");
const messageConsumer_1 = require("./messageConsumer");
const logger_1 = __importDefault(require("../../loaders/logger"));
const timeHandler_1 = __importDefault(require("../../common/timeHandler"));
const models_1 = require("../../models");
/**
 *  @desc 아침 큐 process
 *  @access public
 */
const morningProcess = (job, done) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.appLogger.log({ level: "info", message: "morning queue process START" });
    try {
        const userId = job.data;
        const data = yield getFcmAndContent(userId, timeHandler_1.default.getMorning());
        // data : { fcm, content }
        yield _1.messageQueue.add(`morning-message ${userId}`, data, { attempts: 5 }); //message를 보내는 작업, 5번 시도
        logger_1.default.appLogger.log({ level: "info", message: "morning messageQueue 등록 성공" });
        _1.messageQueue.process(`morning-message ${userId}`, messageConsumer_1.messageProcess);
        done();
    }
    catch (error) {
        logger_1.default.appLogger.log({ level: "error", message: error.message });
    }
});
exports.morningProcess = morningProcess;
/**
 *  @desc 점심 큐 process
 *  @access public
 */
const afterProcess = (job, done) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.appLogger.log({ level: "info", message: "afternoon queue process START" });
    try {
        const userId = job.data;
        const data = yield getFcmAndContent(userId, timeHandler_1.default.getAfternoon());
        yield _1.messageQueue.add(`afternoon-message ${userId}`, data, { attempts: 5 });
        logger_1.default.appLogger.log({ level: "info", message: "afternoon messageQueue 등록 성공" });
        _1.messageQueue.process(`afternoon-message ${userId}`, messageConsumer_1.messageProcess);
        done();
    }
    catch (error) {
        logger_1.default.appLogger.log({ level: "error", message: error.message });
    }
});
exports.afterProcess = afterProcess;
/**
 *  @desc 저녁 큐 process
 *  @access public
 */
const nightProcess = (job, done) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.appLogger.log({ level: "info", message: "night queue process START" });
    logger_1.default.appLogger.log({ level: "info", message: `morningFunc process START` });
    try {
        const userId = job.data;
        const data = yield getFcmAndContent(userId, timeHandler_1.default.getNight());
        yield _1.messageQueue.add(`night-message ${userId}`, data, { attempts: 5 });
        logger_1.default.appLogger.log({ level: "info", message: "night messageQueue 등록 성공" });
        _1.messageQueue.process(`night-message ${userId}`, messageConsumer_1.messageProcess);
        done();
    }
    catch (error) {
        logger_1.default.appLogger.log({ level: "error", message: `nightProcess::${error.message}` });
    }
});
exports.nightProcess = nightProcess;
/**
 *  @desc 예약 큐 process
 *  @access public
 */
const reserveProcess = (job, done) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.appLogger.log({ level: "info", message: "reserve queue process START" });
    logger_1.default.appLogger.log({ level: "info", message: `afterFunc process START` });
    try {
        const userId = job.data;
        const data = yield getFcmAndContent(userId);
        yield _1.messageQueue.add(`reserve-message ${userId}`, data, { attempts: 5 });
        logger_1.default.appLogger.log({ level: "info", message: "reserve messageQueue 등록 성공" });
        _1.messageQueue.process(`reserve-message ${userId}`, messageConsumer_1.messageProcess);
        done();
    }
    catch (error) {
        logger_1.default.appLogger.log({ level: "error", message: error.message });
    }
});
exports.reserveProcess = reserveProcess;
/**
 *  @desc 유저의 fcmtoken 과 보내줄 content 가져오기
 *  @time 정해진 시간대 "아침, 점심, 저녁" | 예약일 경우 없음
 *  @access public
 */
function getFcmAndContent(userId, time) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.appLogger.log({ level: "info", message: `nightFunc process START` });
        try {
            if (time) {
                const { fcmtoken, itemId } = yield models_1.TodayWal.getFcmByUserId(userId, time);
                const { content } = yield models_1.Item.getContentById(itemId);
                return { fcmtoken, content, isReserved: false };
            }
            else { // reservation
                const { fcmtoken, reservationId } = yield models_1.TodayWal.getFcmByUserId(userId);
                const content = yield models_1.Reservation.getContentById(reservationId);
                return { fcmtoken, content, isReserved: true };
            }
        }
        catch (error) {
            logger_1.default.appLogger.log({ level: "error", message: `getFcmAndContent :: ${error.message}` });
            throw error;
        }
    });
}
/**
 * ######################################
 * * ERROR
 * * private method
 * * getFcmAndContent is not a function
 * * & logger 주입 인식 오류
 * ######################################
 */
// class Consumer {
//   constructor(
//     private readonly todayWalRepository: any,
//     private readonly reserveRepository: any,
//     private readonly itemRepository: any,
//     private readonly messageQueue: any,
//     private readonly logger: any
//   ) {
//   }
//   public async processMorning(job: Job, done: DoneCallback) {
//     try {
//       const userId = job.data;
//       const data = await this.getFcmAndContent(userId, timeHandler.getMorning());
//       await this.messageQueue.add(data, { attempts: 5 });
//       this.messageQueue.process(messageFunc);
//       done();
//     } catch (error) {
//       this.logger.appLogger.log({ level: "error", message: error.message });
//       throw error;
//     }
//   }
//   public async processAfternoon(job: Job, done: DoneCallback) {
//     try {
//       const userId = job.data;
//       const data = await this.getFcmAndContent(userId, timeHandler.getAfternoon());
//       await this.messageQueue.add(data, { attempts: 5 });
//       this.messageQueue.process(messageFunc);
//       done();
//     } catch (error) {
//       this.logger.appLogger.log({ level: "error", message: error.message });
//       throw error;
//     }
//   }
//   public async processNight(job: Job, done: DoneCallback) {
//     try {
//       const userId = job.data;
//       const data = await this.getFcmAndContent(userId, timeHandler.getNight()) as { fcmtoken: string, content: string;};
//       await this.messageQueue.add(data, { attempts: 5 });
//       this.messageQueue.process(messageFunc);
//       done();
//     } catch (error) {
//       // this.logger.appLogger.log({ level: "error", message: error.message });
//       console.log(error.message);
//       throw error;
//     }
//   }
//   public async processReserve(job: Job, done: DoneCallback) {
//     try {
//       const userId = job.data;
//       const data = await this.getFcmAndContent(userId);
//       await this.messageQueue.add(data, { attempts: 5 });
//       this.messageQueue.process(messageFunc);
//       done();
//     } catch (error) {
//       this.logger.appLogger.log({ level: "error", message: error.message });
//       throw error;
//     }
//   }
//   private async getFcmAndContent(userId: number, time?: Date) {
//     try {
//       if (time) { 
//         const { fcmtoken, itemId } = await this.todayWalRepository.getFcmByUserId(userId, time) as { fcmtoken: string, itemId: number };
//         console.log(fcmtoken);
//         console.log(itemId);
//         const { content } = await this.itemRepository.getContentById(itemId) as { content: string };
//         console.log(content);
//         return { fcmtoken, content };
//       } else { // reservation
//         const { fcmtoken, reservationId } = await this.todayWalRepository.getFcmByUserId(userId)as { fcmtoken: string, reservationId: number };
//         const content = await this.reserveRepository.getContentById(reservationId) as string;
//         return { fcmtoken, content };
//       }
//     } catch (error) {
//       this.logger.appLogger.log({ level: "error", message: `getFcmAndContent :: ${error.message}` });
//       throw error;
//     }
//   }
// }
// export default Consumer;
//# sourceMappingURL=consumer.js.map