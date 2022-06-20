import { Item, UserCategory } from "../../models";

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

  protected async getRandCategoryCurrentItem(userId: number): Promise<number> {

    try {
      // 유저가 선택한 왈소리 종류 랜덤으로 가져오기
      const userCategories = await this.userCategoryRepository.getUserCategoryByUserId(userId) as UserCategory[];
      const randomIndex: number = Math.floor(Math.random() * (userCategories.length - 1));
      const randomUserCategory: UserCategory = userCategories[randomIndex];

      // 랜덤으로 가져온 왈소리 종류의 아이디와 현재 아이템 아이디
      const currentItemId: number = randomUserCategory.getDataValue("next_item_id");
      const categoryId: number = randomUserCategory.getDataValue("category_id");

      // 랜덤으로 가져온 카테고리에 해당하는 아이템들 다 가져오기
      const sameCategoryItems = await this.itemRepository.getAllItemsByCategoryId(categoryId) as Item[];

      let nextItemId: number = 0; // 세팅해줄 다음 아이템 아이디
      for (const item of sameCategoryItems) {
  
        if (item.getDataValue("id") === currentItemId) {
  
          const itemIndex = sameCategoryItems.indexOf(item); // 근데 얘랑 currentItemId 랑 같은거 아닌가?
          const nextItemIndex = (itemIndex + 1) % sameCategoryItems.length;
          nextItemId = sameCategoryItems[nextItemIndex].getDataValue("id");
  
        }
  
      }
      // 다음 아이템 아이디로 변경 세팅
      await this.userCategoryRepository.updateNext(userId, categoryId, nextItemId);

      return currentItemId;

    } catch(error) {
      throw error;
    }

  };

}

export default UserService;