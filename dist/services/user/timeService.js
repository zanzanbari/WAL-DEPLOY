"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const typedi_1 = require("typedi");
const userService_1 = __importDefault(require("./userService"));
const timeHandler_1 = __importDefault(require("../../common/timeHandler"));
let TimeService = class TimeService extends userService_1.default {
    constructor(userCategoryRepository, itemRepository, timeRepository, todayWalRepository, timeQueueEvent, logger) {
        super(userCategoryRepository, itemRepository);
        this.userCategoryRepository = userCategoryRepository;
        this.itemRepository = itemRepository;
        this.timeRepository = timeRepository;
        this.todayWalRepository = todayWalRepository;
        this.timeQueueEvent = timeQueueEvent;
        this.logger = logger;
    }
    /**
     *  @desc 유저_알람시간_수정
     *  @route POST /user/info/time
     *  @access public
     */
    resetTimeInfo(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const beforeSetTime = request[0]; // 이전 설정값
            const afterSetTime = request[1]; // 새로운 설정값
            try {
                yield this.timeRepository.updateTime(userId, afterSetTime);
                const updatedTime = this.timeRepository.findById(userId);
                const isCanceledTime = this.extractCanceledTime(beforeSetTime, afterSetTime);
                this.setCanceledTime(isCanceledTime, userId);
                const isAddedTime = this.extractAddedTime(beforeSetTime, afterSetTime);
                this.setAddedTime(isAddedTime, userId);
                return yield updatedTime;
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
    setAddedTime(isAddedTime, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentTime = timeHandler_1.default.getCurrentTime();
            try {
                for (const time of isAddedTime) {
                    if (time > currentTime) {
                        this.timeQueueEvent.emit("updateAddTimeQueue", userId, time);
                        const { currentItemId, categoryId } = yield this.getRandCategoryCurrentItem(userId);
                        const data = {
                            userId,
                            categoryId,
                            itemId: currentItemId,
                            time
                        };
                        yield this.todayWalRepository.setTodayWal(data);
                    }
                }
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: `setAddedTime :: ${error.message}` });
                throw error;
            }
        });
    }
    setCanceledTime(isCanceledTime, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentTime = timeHandler_1.default.getCurrentTime();
            try {
                for (const time of isCanceledTime) {
                    this.timeQueueEvent.emit("updateCancelTimeQueue", userId, time);
                    if (time > currentTime) {
                        yield this.todayWalRepository.deleteTodayWal(userId, time);
                    }
                }
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: `setCanceledTime :: ${error.message}` });
                throw error;
            }
        });
    }
    extractAddedTime(beforeSetTime, afterSetTime) {
        const isAddedTime = [];
        if (beforeSetTime.morning === false && afterSetTime.morning === true)
            isAddedTime.push(timeHandler_1.default.getMorning());
        if (beforeSetTime.afternoon === false && afterSetTime.afternoon === true)
            isAddedTime.push(timeHandler_1.default.getAfternoon());
        if (beforeSetTime.night === false && afterSetTime.night === true)
            isAddedTime.push(timeHandler_1.default.getNight());
        return isAddedTime;
    }
    extractCanceledTime(beforeSetTime, afterSetTime) {
        const isCanceledTime = [];
        if (beforeSetTime.morning === true && afterSetTime.morning === false)
            isCanceledTime.push(timeHandler_1.default.getMorning());
        if (beforeSetTime.afternoon === true && afterSetTime.afternoon === false)
            isCanceledTime.push(timeHandler_1.default.getAfternoon());
        if (beforeSetTime.night === true && afterSetTime.night === false)
            isCanceledTime.push(timeHandler_1.default.getNight());
        return isCanceledTime;
    }
};
TimeService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], TimeService);
exports.default = TimeService;
//# sourceMappingURL=timeService.js.map