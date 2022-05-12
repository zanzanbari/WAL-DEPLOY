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
const timeHandler_1 = __importDefault(require("../../modules/timeHandler"));
const typedi_1 = require("typedi");
const producer_1 = require("../pushAlarm/producer");
const pushAlarm_1 = require("../pushAlarm");
let UserService = class UserService {
    constructor(userRepository, timeRepository, itemRepository, userCategoryRepository, todayWalRepository, logger) {
        this.userRepository = userRepository;
        this.timeRepository = timeRepository;
        this.itemRepository = itemRepository;
        this.userCategoryRepository = userCategoryRepository;
        this.todayWalRepository = todayWalRepository;
        this.logger = logger;
        this.categorySelection = {
            joke: false,
            compliment: false,
            condolence: false,
            scolding: false
        };
    }
    initSetInfo(userId, request) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.timeRepository.setTime(userId, request.time);
                yield this.userRepository.setNickname(userId, request.nickname);
                // 유형 선택
                // 각각 T/F 뽑아서 => T면 새로운 배열에 그 인덱스 번호 넣어, F면 넣지마
                const dtypeBoolInfo = this.extractBooleanInfo(request.dtype);
                const dtypeIdx = [];
                for (let i = 0; i < dtypeBoolInfo.length; i++) {
                    if (dtypeBoolInfo[i] === true) {
                        dtypeIdx.push(i);
                    }
                }
                // dtypeIdx = [0, 1, 2] 일때~~
                dtypeIdx.forEach((categoryId) => __awaiter(this, void 0, void 0, function* () {
                    const firstItemId = yield this.itemRepository.getFirstIdEachOfCategory(categoryId);
                    this.infoToUserCategoryDB = {
                        user_id: userId,
                        category_id: categoryId,
                        next_item_id: firstItemId,
                    };
                    yield this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB);
                }));
                // todayWals에 들어갈 놈   
                // FIXME randomIdx 뽑는거 다시 생각 ㄲ
                if (((_a = request.time) === null || _a === void 0 ? void 0 : _a.morning) === true) {
                    // 카테고리 아이디를 랜덤으로 뽑자 
                    const randIdx = Math.floor(Math.random() * (dtypeIdx.length));
                    const randCategoryId = dtypeIdx[randIdx];
                    const data = {
                        user_id: userId,
                        category_id: randCategoryId,
                        item_id: yield this.itemRepository.getFirstIdEachOfCategory(randCategoryId),
                        time: timeHandler_1.default.getMorning() // morning이면 8시, afternoon이면 12시, night면 20시.......
                    };
                    yield this.todayWalRepository.setTodayWal(data);
                }
                if (((_b = request.time) === null || _b === void 0 ? void 0 : _b.afternoon) === true) {
                    const randIdx = Math.floor(Math.random() * (dtypeIdx.length));
                    const randCategoryId = dtypeIdx[randIdx];
                    const data = {
                        user_id: userId,
                        category_id: randCategoryId,
                        item_id: yield this.itemRepository.getFirstIdEachOfCategory(randCategoryId),
                        time: timeHandler_1.default.getAfternoon()
                    };
                    yield this.todayWalRepository.setTodayWal(data);
                }
                if (((_c = request.time) === null || _c === void 0 ? void 0 : _c.night) === true) {
                    const randIdx = Math.floor(Math.random() * (dtypeIdx.length));
                    const randCategoryId = dtypeIdx[randIdx];
                    const data = {
                        user_id: userId,
                        category_id: randCategoryId,
                        item_id: yield this.itemRepository.getFirstIdEachOfCategory(randCategoryId),
                        time: timeHandler_1.default.getNight()
                    };
                    yield this.todayWalRepository.setTodayWal(data);
                }
                (0, producer_1.addUserTime)(userId);
                return { nickname: request.nickname };
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    getCategoryInfo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dtypeInfo = this.userCategoryRepository.findCategoryByUserId(userId);
                this.setCategoryInfo(yield dtypeInfo);
                return this.categorySelection;
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    resetTimeInfo(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const beforeSetTime = request[0]; // 이전 설정값
                const afterSetTime = request[1]; // 새로운 설정값
                this.compareMorningSetAndControlQueueByUserId(beforeSetTime.morning, afterSetTime.morning, userId);
                this.compareAfternoonSetAndControlQueueByUserId(beforeSetTime.afternoon, afterSetTime.afternoon, userId);
                this.compareNightSetAndControlQueueByUserId(beforeSetTime.night, afterSetTime.night, userId);
                yield this.timeRepository.updateTime(userId, afterSetTime);
                yield this.todayWalRepository.deleteTodayWal(userId);
                const timeSelection = [];
                if (afterSetTime.morning == true)
                    timeSelection.push(timeHandler_1.default.getMorning());
                if (afterSetTime.afternoon == true)
                    timeSelection.push(timeHandler_1.default.getAfternoon());
                if (afterSetTime.night == true)
                    timeSelection.push(timeHandler_1.default.getNight());
                // FIXME getRandCategoryCurrentItem 에서 중복 발생 이슈
                timeSelection.forEach((time) => __awaiter(this, void 0, void 0, function* () {
                    const currentItemId = yield (0, pushAlarm_1.getRandCategoryCurrentItem)(userId);
                    const data = {
                        user_id: userId,
                        item_id: currentItemId,
                        time
                    };
                    yield this.todayWalRepository.setTodayWal(data);
                }));
                return yield this.timeRepository.findById(userId);
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    resetUserCategoryInfo(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const beforeCategoryInfo = request[0]; // 이전 설정값
                const afterCategoryInfo = request[1]; // 새로운 설정값
                const before = this.extractBooleanInfo(beforeCategoryInfo);
                const after = this.extractBooleanInfo(afterCategoryInfo);
                for (let categoryId = 0; categoryId < 4; categoryId++) {
                    if (before[categoryId] === true && after[categoryId] === false) { // 삭제
                        yield this.userCategoryRepository.deleteUserCategory(userId, categoryId);
                    }
                    else if (before[categoryId] === false && after[categoryId] === true) { // 생성
                        const firstItemId = yield this.itemRepository.getFirstIdEachOfCategory(categoryId);
                        this.infoToUserCategoryDB = {
                            user_id: userId,
                            category_id: categoryId,
                            next_item_id: firstItemId,
                        };
                        yield this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB);
                    }
                }
                const dtypeInfo = this.userCategoryRepository.findCategoryByUserId(userId);
                this.setCategoryInfo(yield dtypeInfo);
                return this.categorySelection;
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    extractBooleanInfo(property) {
        const extractedInfo = [];
        for (const key in property) { // 객체 탐색 for...in
            extractedInfo.push(property[key]);
        }
        return extractedInfo;
    }
    setCategoryInfo(data) {
        data.forEach(it => {
            if (it === "joke")
                this.categorySelection.joke = true;
            if (it === "compliment")
                this.categorySelection.compliment = true;
            if (it === "condolence")
                this.categorySelection.condolence = true;
            if (it === "scolding")
                this.categorySelection.scolding = true;
        });
    }
    // TODO: 비동기 처리 
    // FIXME: 함수 일 줄이기 (단일책임), true 설정 시간대가 현재 시간 기준 이전인지 이후인지 
    // 이전 => queue에 추가할 필요 없음
    // 이후 => queue에 추가 필수
    compareNightSetAndControlQueueByUserId(beforeNight, afterNight, _userId) {
        if (beforeNight === true && afterNight === false)
            (0, producer_1.updateUserTime)(_userId, "night", "remove");
        else if (beforeNight === false && afterNight === true)
            (0, producer_1.updateUserTime)(_userId, "night", "add");
    }
    compareAfternoonSetAndControlQueueByUserId(beforeAfternoon, afterAfternoon, _userId) {
        if (beforeAfternoon === true && afterAfternoon === false)
            (0, producer_1.updateUserTime)(_userId, "afternoon", "remove");
        else if (beforeAfternoon === false && afterAfternoon === true)
            (0, producer_1.updateUserTime)(_userId, "afternoon", "add");
    }
    compareMorningSetAndControlQueueByUserId(beforeMorning, afterMorning, _userId) {
        if (beforeMorning === true && afterMorning === false)
            (0, producer_1.updateUserTime)(_userId, "morning", "remove");
        else if (beforeMorning === false && afterMorning === true)
            (0, producer_1.updateUserTime)(_userId, "morning", "add");
    }
};
UserService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], UserService);
exports.default = UserService;
//# sourceMappingURL=userService.js.map