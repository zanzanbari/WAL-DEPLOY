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
const pushAlarm_1 = require("../pushAlarm");
const timeHandler_1 = __importDefault(require("../../common/timeHandler"));
let InitService = class InitService {
    constructor(userRepository, timeRepository, itemRepository, userCategoryRepository, todayWalRepository, timeQueueEvent, logger) {
        this.userRepository = userRepository;
        this.timeRepository = timeRepository;
        this.itemRepository = itemRepository;
        this.userCategoryRepository = userCategoryRepository;
        this.todayWalRepository = todayWalRepository;
        this.timeQueueEvent = timeQueueEvent;
        this.logger = logger;
    }
    /**
     *  @유저_초기_설정
     *  @route POST /user/set-info
     *  @access public
     */
    initSetInfo(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 초기 알람 시간 설정
                yield this.timeRepository.setTime(userId, request.time);
                // 설정한 알람 시간 큐에 추가
                this.timeQueueEvent.emit("addUserTime", userId);
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
            for (let i = 0; i < selectedTimes.length; i++) {
                const currentItemId = (0, pushAlarm_1.getRandCategoryCurrentItem)(userId);
                const data = {
                    user_id: userId,
                    item_id: yield currentItemId,
                    time: selectedTimes[i]
                };
                yield this.todayWalRepository.setTodayWal(data);
            }
        });
    }
    extractSelectedTimes(time) {
        const timeSelection = [];
        if (time.morning == true)
            timeSelection.push(timeHandler_1.default.getMorning());
        if (time.afternoon == true)
            timeSelection.push(timeHandler_1.default.getAfternoon());
        if (time.night == true)
            timeSelection.push(timeHandler_1.default.getNight());
        return timeSelection;
    }
    setUserCategory(selectedIds, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < selectedIds.length; index++) {
                const categoryId = selectedIds[index];
                const firstItemId = this.itemRepository.getFirstIdEachOfCategory(categoryId);
                this.infoToUserCategoryDB = {
                    user_id: userId,
                    category_id: categoryId,
                    next_item_id: yield firstItemId,
                };
                yield this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB);
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
    /**
     *  @Bool값_추출
     *  @desc 유저가 선택한 유형(category) 확인하기 위해
     *  @access private
     */
    extractBooleanInfo(property) {
        const extractedInfo = [];
        for (const key in property) { // 객체 탐색 for...in
            extractedInfo.push(property[key]);
        }
        return extractedInfo;
    }
};
InitService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], InitService);
exports.default = InitService;
//# sourceMappingURL=initService.js.map