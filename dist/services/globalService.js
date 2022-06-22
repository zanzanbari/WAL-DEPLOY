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
const node_schedule_1 = __importDefault(require("node-schedule"));
const timeHandler_1 = __importDefault(require("../common/timeHandler"));
const userService_1 = __importDefault(require("./user/userService"));
class GlobalService extends userService_1.default {
    constructor(userCategoryRepository, itemRepository, todayWalRepository, userRepository, timeRepository, logger) {
        super(userCategoryRepository, itemRepository);
        this.userCategoryRepository = userCategoryRepository;
        this.itemRepository = itemRepository;
        this.todayWalRepository = todayWalRepository;
        this.userRepository = userRepository;
        this.timeRepository = timeRepository;
        this.logger = logger;
    }
    /**
     *  @desc 매일 00시 왈소리 세팅
     *  @access public
     */
    updateAtNoonEveryDay() {
        this.logger.appLogger.log({ level: "info", message: "✅ scheduler 등록 완료" });
        node_schedule_1.default.scheduleJob("0 0 0 * * *", () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.todayWalRepository.deleteAll();
                yield this.updateAllUserTodayWal();
                this.logger.appLogger.log({ level: "info", message: "🐶 오늘의 왈 업데이트" });
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        }));
    }
    /**
     *  @desc 모든 유저 탐색 후 오늘의 왈소리 세팅
     *  @access private
     */
    updateAllUserTodayWal() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 설정 완료된 유저들 가져오기
                const isInitUserIds = yield this.timeRepository.getAllUserIds();
                // 유저들의 시간, 예약 정보 가져오기
                const userAndTimeAndReserveInfo = yield this.userRepository.getUserTimeReserveInfo(isInitUserIds);
                for (const userInfo of userAndTimeAndReserveInfo) {
                    const selectedTime = [];
                    const timeInfo = userInfo.getDataValue("time");
                    if (timeInfo.getDataValue("morning"))
                        selectedTime.push(timeHandler_1.default.getMorning());
                    if (timeInfo.getDataValue("afternoon"))
                        selectedTime.push(timeHandler_1.default.getAfternoon());
                    if (timeInfo.getDataValue("night"))
                        selectedTime.push(timeHandler_1.default.getNight());
                    const userId = userInfo.getDataValue("id");
                    for (const time of selectedTime) {
                        const { currentItemId, categoryId } = yield this.getRandCategoryCurrentItem(userId);
                        const data = {
                            userId,
                            categoryId,
                            itemId: currentItemId,
                            time
                        };
                        // 유저가 선택한 시간대에 오늘의 왈소리 세팅
                        yield this.todayWalRepository.setTodayWal(data);
                    }
                    const reserveInfo = userInfo.getDataValue("reservations");
                    if (reserveInfo.length !== 0) { // 유저가 예약해둔 왈소리가 있으면
                        for (const reserve of reserveInfo) {
                            const currentDate = timeHandler_1.default.toUtcTime(reserve.sendingDate).toISOString().split("T")[0];
                            if (currentDate == timeHandler_1.default.getCurrentDate()) { // 예약해둔 왈소리 날짜와 업데이트 시점 현재 날짜와 같으면
                                const data = {
                                    userId,
                                    reservationId: reserve.id,
                                    time: reserve.sendingDate,
                                    userDefined: true
                                };
                                yield this.todayWalRepository.setTodayWal(data);
                            }
                        }
                    }
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = GlobalService;
//# sourceMappingURL=globalService.js.map