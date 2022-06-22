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
let InitService = class InitService extends userService_1.default {
    constructor(itemRepository, userCategoryRepository, userRepository, timeRepository, todayWalRepository, timeQueueEvent, logger) {
        super(userCategoryRepository, itemRepository);
        this.itemRepository = itemRepository;
        this.userCategoryRepository = userCategoryRepository;
        this.userRepository = userRepository;
        this.timeRepository = timeRepository;
        this.todayWalRepository = todayWalRepository;
        this.timeQueueEvent = timeQueueEvent;
        this.logger = logger;
    }
    /**
     *  @desc 유저_초기_설정
     *  @route POST /user/set-info
     *  @access public
     */
    initSetInfo(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 초기 알람 시간 설정
                yield this.timeRepository.setTime(userId, request.time);
                // 설정한 알람 시간 큐에 추가
                this.timeQueueEvent.emit("addTimeQueue", userId, request.time);
                // 초기 닉네임 설정
                yield this.userRepository.setNickname(userId, request.nickname);
                // 알람 받을 유형 설정
                const dtypeBoolInfo = this.extractBooleanInfo(request.dtype);
                const selectedIds = this.extractSelectedCategoryIds(dtypeBoolInfo);
                yield this.setUserCategory(selectedIds, userId);
                // todayWals 세팅
                const selectedTimes = this.extractSelectedTimes(request.time);
                yield this.setTodayWals(selectedTimes, userId);
                return { nickname: request.nickname };
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
    setTodayWals(selectedTimes, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let i = 0; i < selectedTimes.length; i++) {
                    const { currentItemId, categoryId } = yield this.getRandCategoryCurrentItem(userId);
                    const data = {
                        userId,
                        categoryId,
                        itemId: currentItemId,
                        time: selectedTimes[i]
                    };
                    yield this.todayWalRepository.setTodayWal(data);
                }
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: `setTodayWals :: ${error.message}` });
                throw error;
            }
        });
    }
    setUserCategory(selectedIds, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let index = 0; index < selectedIds.length; index++) {
                    const categoryId = selectedIds[index];
                    const firstItemId = this.itemRepository.getFirstIdEachOfCategory(categoryId);
                    this.infoToUserCategoryDB = {
                        userId,
                        categoryId,
                        nextItemId: yield firstItemId,
                    };
                    yield this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB);
                }
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: `setUserCategory :: ${error.message}` });
                throw error;
            }
        });
    }
    extractSelectedCategoryIds(dtypeBoolInfo) {
        const dtypeIds = [];
        for (let i = 0; i < dtypeBoolInfo.length; i++) {
            if (dtypeBoolInfo[i] === true) {
                dtypeIds.push(i);
            }
        }
        return dtypeIds;
    }
};
InitService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], InitService);
exports.default = InitService;
//# sourceMappingURL=initService.js.map