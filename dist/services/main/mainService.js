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
let MainService = class MainService {
    constructor(todayWalRepository, reservationRepository, itemRepository, logger) {
        this.todayWalRepository = todayWalRepository;
        this.reservationRepository = reservationRepository;
        this.itemRepository = itemRepository;
        this.logger = logger;
    }
    /**
     *  @desc 메인화면
     *  @route GET /main
     *  @access public
     */
    getMain(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todayWals = this.todayWalRepository.getTodayWalsByUserId(userId);
                const main = this.getMainResult(yield todayWals);
                return yield main;
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
    getMainResult(todayWals) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                for (const todayWal of todayWals) {
                    let mainResponse = {
                        type: "default",
                        content: "default",
                        canOpen: false,
                        categoryId: -1
                    };
                    const time = todayWal.getDataValue("time");
                    mainResponse.canOpen = timeHandler_1.default.getCurrentTime().getTime() >= time.getTime() ? true : false;
                    if (todayWal.getDataValue("userDefined")) { // 직접 예약한 왈소리라면
                        const reservationId = todayWal.getDataValue("reservationId");
                        const content = this.reservationRepository.getContentById(reservationId);
                        mainResponse.type = "스페셜";
                        mainResponse.content = yield content;
                    }
                    else { // 직접 예약한 왈소리가 아니라면
                        const itemId = todayWal.getDataValue("itemId");
                        const { content, categoryId } = yield this.itemRepository.getContentById(itemId);
                        mainResponse.content = content;
                        mainResponse.categoryId = categoryId;
                        if (time.getTime() === timeHandler_1.default.getMorning().getTime())
                            mainResponse.type = "아침";
                        if (time.getTime() === timeHandler_1.default.getAfternoon().getTime())
                            mainResponse.type = "점심";
                        if (time.getTime() === timeHandler_1.default.getNight().getTime())
                            mainResponse.type = "저녁";
                    }
                    result.push(mainResponse);
                }
                return result;
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: `getMainResult :: ${error.message}` });
                throw error;
            }
        });
    }
};
MainService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], MainService);
;
exports.default = MainService;
//# sourceMappingURL=mainService.js.map