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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let UserService = class UserService {
    constructor(userRepository, timeRepository, itemRepository, userCategoryRepository, logger) {
        this.userRepository = userRepository;
        this.timeRepository = timeRepository;
        this.itemRepository = itemRepository;
        this.userCategoryRepository = userCategoryRepository;
        this.logger = logger;
        this.timeSelection = {
            morning: false,
            afternoon: false,
            night: false
        };
    }
    initSetInfo(userId, request) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 시간 선택
                (_a = request.time) === null || _a === void 0 ? void 0 : _a.forEach(it => {
                    if (it === "morning")
                        this.timeSelection.morning = true;
                    if (it === "afternoon")
                        this.timeSelection.afternoon = true;
                    if (it === "night")
                        this.timeSelection.night = true;
                });
                // 유형 선택
                (_b = request.dtype) === null || _b === void 0 ? void 0 : _b.forEach((it) => __awaiter(this, void 0, void 0, function* () {
                    const firstItemId = yield this.itemRepository.getFirstIdEachOfCategory(it);
                    this.categorySelection = {
                        user_id: userId,
                        category_id: it,
                        next_item_id: firstItemId,
                    };
                    yield this.userCategoryRepository.setUserCategory(this.categorySelection);
                }));
                yield this.timeRepository.setTime(userId, this.timeSelection);
                yield this.userRepository.setNickname(userId, request.nickname);
                return { nickname: request.nickname };
            }
            catch (error) {
                this.logger.appLogger.log({
                    level: "error",
                    message: error.message
                });
                throw new Error(error);
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
                // FIXME: category pk의 인덱스 번호 차이
                for (let categoryId = 0; categoryId < 4; categoryId++) {
                    if (before[categoryId] === true && after[categoryId] === false) { // 삭제
                        yield this.userCategoryRepository.deleteUserCategory(userId, categoryId);
                    }
                    else if (before[categoryId] === false && after[categoryId] === true) { // 생성
                        // FIXME: item 당연히 있겠지마는~~ ㄹㅇ 없을땐 어캄? -> 고민 ㄱ
                        const firstItemId = yield this.itemRepository.getFirstIdEachOfCategory(categoryId);
                        this.categorySelection = {
                            user_id: userId,
                            category_id: categoryId,
                            next_item_id: firstItemId,
                        };
                        yield this.userCategoryRepository.setUserCategory(this.categorySelection);
                    }
                }
                const resultInfo = this.userCategoryRepository.findCategoryByUserId(userId);
                return yield resultInfo;
            }
            catch (error) {
                this.logger.appLogger.log({
                    level: "error",
                    message: error.message
                });
                throw new Error(error);
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
};
UserService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], UserService);
exports.default = UserService;
//# sourceMappingURL=userService.js.map