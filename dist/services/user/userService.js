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
        this.categorySelection = {
            joke: false,
            compliment: false,
            condolence: false,
            scolding: false
        };
    }
    initSetInfo(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 유형 선택
                // 각각 T/F 뽑아서 => T면 새로운 배열에 그 인덱스 번호 넣어, F면 넣지마
                const dtypeBoolInfo = this.extractBooleanInfo(request.dtype);
                const dtypeIdx = [];
                dtypeBoolInfo.forEach(it => {
                    if (it === true) {
                        dtypeIdx.push(dtypeBoolInfo.indexOf(it));
                    }
                });
                dtypeIdx.forEach((categoryId) => __awaiter(this, void 0, void 0, function* () {
                    const firstItemId = yield this.itemRepository.getFirstIdEachOfCategory(categoryId);
                    this.infoToUserCategoryDB = {
                        user_id: userId,
                        category_id: categoryId,
                        next_item_id: firstItemId,
                    };
                    yield this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB);
                }));
                yield this.timeRepository.setTime(userId, request.time);
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
    getCategoryInfo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dtypeInfo = this.userCategoryRepository.findCategoryByUserId(userId);
                this.setCategoryInfo(yield dtypeInfo);
                return this.categorySelection;
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
};
UserService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], UserService);
exports.default = UserService;
//# sourceMappingURL=userService.js.map