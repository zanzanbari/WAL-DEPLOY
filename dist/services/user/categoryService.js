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
const timeHandler_1 = __importDefault(require("../../common/timeHandler"));
const userService_1 = __importDefault(require("./userService"));
let CategoryService = class CategoryService extends userService_1.default {
    constructor(userCategoryRepository, todayWalRepository, timeRepository, itemRepository, logger) {
        super(userCategoryRepository, itemRepository);
        this.userCategoryRepository = userCategoryRepository;
        this.todayWalRepository = todayWalRepository;
        this.timeRepository = timeRepository;
        this.itemRepository = itemRepository;
        this.logger = logger;
        this.categorySelection = {
            joke: false,
            compliment: false,
            condolence: false,
            scolding: false
        };
    }
    /**
     *  @desc ??????_???????????????_??????_??????
     *  @route GET /user/info/category
     *  @access public
     */
    getCategoryInfo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dtypeInfo = this.userCategoryRepository.findCategoryByUserId(userId);
                this.setCategorySelection(yield dtypeInfo);
                return this.categorySelection;
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    /**
     *  @desc ??????_???????????????_??????_??????
     *  @route POST /user/info/category
     *  @access public
     */
    resetUserCategoryInfo(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const beforeCategoryInfo = request[0]; // ?????? ?????????
            const afterCategoryInfo = request[1]; // ????????? ?????????
            const before = this.extractBooleanInfo(beforeCategoryInfo);
            const after = this.extractBooleanInfo(afterCategoryInfo);
            try {
                // ????????? ????????? ????????? ??????
                const timeInfo = yield this.timeRepository.findById(userId);
                const settedTime = this.extractSelectedTimes(timeInfo);
                // ????????? ????????? ???????????? ?????? ????????? ?????? ????????? ??????, ?????? ?????? ???????????? ?????? ?????? ????????? ??? ??? ??????
                const afterTime = this.compareAfterTime(settedTime);
                yield this.resetUserCategory(before, after, userId, afterTime);
                const dtypeInfo = this.userCategoryRepository.findCategoryByUserId(userId);
                this.setCategorySelection(yield dtypeInfo);
                return this.categorySelection;
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
    resetUserCategory(before, after, userId, afterTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let categoryId = 0; categoryId < 4; categoryId++) {
                    if (before[categoryId] === true && after[categoryId] === false) { // ??????
                        for (const time of afterTime) { // ?????? ?????? ????????? ?????? ???????????? ????????? ????????? ?????????
                            yield this.todayWalRepository.deleteTodayWal(userId, time, categoryId); // ????????? ??????
                        }
                        yield this.userCategoryRepository.deleteUserCategory(userId, categoryId);
                    }
                    else if (before[categoryId] === false && after[categoryId] === true) { // ??????
                        const firstItemId = this.itemRepository.getFirstIdEachOfCategory(categoryId);
                        this.infoToUserCategoryDB = {
                            userId,
                            categoryId,
                            nextItemId: yield firstItemId, // ?????? ????????? ????????? ????????? item
                        };
                        yield this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB);
                        for (const time of afterTime) { // ?????? ?????? ????????? ?????? ???????????? ????????? ????????? ?????????
                            const { currentItemId, categoryId } = yield this.getRandCategoryCurrentItem(userId);
                            const data = {
                                userId,
                                categoryId,
                                itemId: currentItemId,
                                time
                            };
                            console.log(data);
                            yield this.todayWalRepository.setTodayWal(data); // ????????? ??????
                        }
                    }
                }
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: `resetUserCategory :: ${error.message}` });
            }
        });
    }
    compareAfterTime(settedTime) {
        const afterTime = [];
        for (const time of settedTime) {
            if (time > timeHandler_1.default.getCurrentTime()) {
                afterTime.push(time);
            }
        }
        return afterTime;
    }
    setCategorySelection(data) {
        for (const dtype of data) {
            if (dtype === "joke")
                this.categorySelection.joke = true;
            if (dtype === "compliment")
                this.categorySelection.compliment = true;
            if (dtype === "condolence")
                this.categorySelection.condolence = true;
            if (dtype === "scolding")
                this.categorySelection.scolding = true;
        }
    }
};
CategoryService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CategoryService);
exports.default = CategoryService;
//# sourceMappingURL=categoryService.js.map