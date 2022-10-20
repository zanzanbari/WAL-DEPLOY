import { Item, UserCategory } from "../../models";
import { ISetCategory, ISetTime } from "../../dto/request/userRequest";
import timeHandler from "../../common/timeHandler";

abstract class UserService {

  constructor(
    protected readonly userCategoryRepository: any,
    protected readonly itemRepository: any
  ) {
  }

  /**
   *  @desc 랜덤 및 순차적으로 유저에게 보낼 itemId 세팅 후 현재 itemId(이번에 보내줄 아이템 아이디) 반환
   *  @access protected
   */

  protected async getRandCategoryCurrentItem(userId: number): Promise<{ 
    currentItemId: number; 
    categoryId: number; 
  }> {

    try {
      // 유저가 선택한 왈소리 종류 랜덤으로 가져오기
      const userCategories = await this.userCategoryRepository.getUserCategoryByUserId(userId) as UserCategory[];
      const randomIndex: number = Math.floor(Math.random() * (userCategories.length - 1));
      const randomUserCategory: UserCategory = userCategories[randomIndex];

      // 랜덤으로 가져온 왈소리 종류의 아이디와 현재 아이템 아이디
      const currentItemId: number = randomUserCategory.getDataValue("nextItemId");
      const categoryId: number = randomUserCategory.getDataValue("categoryId");

      // 랜덤으로 가져온 카테고리에 해당하는 아이템들 다 가져오기
      const sameCategoryItems = await this.itemRepository.getAllItemsByCategoryId(categoryId) as Item[];

      let nextItemId: number = 0; // 세팅해줄 다음 아이템 아이디
      for (const item of sameCategoryItems) {
  
        if (item.getDataValue("id") == currentItemId) {
  
          const itemIndex = sameCategoryItems.indexOf(item);
          const nextItemIndex = (itemIndex + 1) % sameCategoryItems.length;
          nextItemId = sameCategoryItems[nextItemIndex].getDataValue("id");
          break
        }
      }
      // 다음 아이템 아이디로 변경 세팅
      await this.userCategoryRepository.updateNext(userId, categoryId, nextItemId);

      return { currentItemId, categoryId };

    } catch(error) {
      throw error;
    }

  };

  /**
   *  @Bool값_추출
   *  @desc 유저가 선택한 유형(category) 확인하기 위해
   *  @access protected
   */

   protected extractBooleanInfo(property: ISetCategory): boolean[] {
    const extractedInfo: boolean[] = [];
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

  protected extractSelectedTimes(timeInfo: ISetTime): Date[] {
    const selectedTimes: Date[] = [];
    if (timeInfo.morning) selectedTimes.push(timeHandler.getMorning());
    if (timeInfo.afternoon) selectedTimes.push(timeHandler.getAfternoon());
    if (timeInfo.night) selectedTimes.push(timeHandler.getNight());
    return selectedTimes;
  }

}

export default UserService;