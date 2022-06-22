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
const timeHandler_1 = __importDefault(require("../../common/timeHandler"));
class UserService {
    constructor(userCategoryRepository, itemRepository) {
        this.userCategoryRepository = userCategoryRepository;
        this.itemRepository = itemRepository;
    }
    /**
     *  @desc 랜덤 및 순차적으로 유저에게 보낼 itemId 세팅 후 현재 itemId(이번에 보내줄 아이템 아이디) 반환
     *  @access protected
     */
    getRandCategoryCurrentItem(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 유저가 선택한 왈소리 종류 랜덤으로 가져오기
                const userCategories = yield this.userCategoryRepository.getUserCategoryByUserId(userId);
                const randomIndex = Math.floor(Math.random() * (userCategories.length - 1));
                const randomUserCategory = userCategories[randomIndex];
                // 랜덤으로 가져온 왈소리 종류의 아이디와 현재 아이템 아이디
                const currentItemId = randomUserCategory.getDataValue("nextItemId");
                const categoryId = randomUserCategory.getDataValue("categoryId");
                // 랜덤으로 가져온 카테고리에 해당하는 아이템들 다 가져오기
                const sameCategoryItems = yield this.itemRepository.getAllItemsByCategoryId(categoryId);
                let nextItemId = 0; // 세팅해줄 다음 아이템 아이디
                for (const item of sameCategoryItems) {
                    if (item.getDataValue("id") === currentItemId) {
                        const itemIndex = sameCategoryItems.indexOf(item); // 근데 얘랑 currentItemId 랑 같은거 아닌가?
                        const nextItemIndex = (itemIndex + 1) % sameCategoryItems.length;
                        nextItemId = sameCategoryItems[nextItemIndex].getDataValue("id");
                    }
                }
                // 다음 아이템 아이디로 변경 세팅
                yield this.userCategoryRepository.updateNext(userId, categoryId, nextItemId);
                return { currentItemId, categoryId };
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
    /**
     *  @Bool값_추출
     *  @desc 유저가 선택한 유형(category) 확인하기 위해
     *  @access protected
     */
    extractBooleanInfo(property) {
        const extractedInfo = [];
        for (const key in property) { // 객체 탐색 for...in
            extractedInfo.push(property[key]);
        }
        return extractedInfo;
    }
    /**
     *  @Bool값_추출
     *  @desc 유저가 설정한 시간대만 축출
     *  @access protected
     */
    extractSelectedTimes(timeInfo) {
        const selectedTimes = [];
        if (timeInfo.morning)
            selectedTimes.push(timeHandler_1.default.getMorning());
        if (timeInfo.afternoon)
            selectedTimes.push(timeHandler_1.default.getAfternoon());
        if (timeInfo.night)
            selectedTimes.push(timeHandler_1.default.getNight());
        return selectedTimes;
    }
}
exports.default = UserService;
//# sourceMappingURL=userService.js.map