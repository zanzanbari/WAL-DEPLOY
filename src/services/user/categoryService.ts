import { Service } from "typedi";
import { 
  ISetCategory, 
  ISetUserCategory, 
  ResetCategoryDto } from "../../dto/request/userRequest";

@Service()
class CategoryService {

  private infoToUserCategoryDB!: ISetUserCategory; 
  private categorySelection: ISetCategory = {
    joke: false,
    compliment: false,
    condolence: false,
    scolding: false
  };

  constructor(
    private readonly userCategoryRepository: any,
    private readonly itemRepository: any,
    private readonly logger: any
  ) {
  }

  /**
   *  @유저_왈소리유형_정보_조회
   *  @route GET /user/info/category
   *  @access public
   */

  public async getCategoryInfo(userId: number): Promise<ISetCategory> { 

    try {
      
      const dtypeInfo = this.userCategoryRepository.findCategoryByUserId(userId) as Promise<string[]>;
      this.setCategorySelection(await dtypeInfo);

      return this.categorySelection;

    } catch (error) {
        this.logger.appLogger.log({ level: "error", message: error.message });
        throw error;
    }
  }

  /**
   *  @유저_왈소리유형_정보_수정
   *  @route POST /user/info/category
   *  @access public
   */

  public async resetUserCategoryInfo( 
    userId: number,
    request: ResetCategoryDto
  ): Promise<ISetCategory> {

    const beforeCategoryInfo: ISetCategory = request[0]; // 이전 설정값
    const afterCategoryInfo: ISetCategory = request[1]; // 새로운 설정값

    const before: boolean[] = this.extractBooleanInfo(beforeCategoryInfo);
    const after: boolean[] = this.extractBooleanInfo(afterCategoryInfo);

    try { 

      await this.resetUserCategory(before, after, userId);

      const dtypeInfo: Promise<string[]> = this.userCategoryRepository.findCategoryByUserId(userId);
      this.setCategorySelection(await dtypeInfo);
        
      return this.categorySelection;

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

  /**
   * -------------------------
   *  @access private Method
   * -------------------------
   */

  private async resetUserCategory(
    before: boolean[], 
    after: boolean[], 
    userId: number
  ): Promise<void> {

    for (let categoryId = 0; categoryId < 4; categoryId++) {

      if (before[categoryId] === true && after[categoryId] === false) { // 삭제

        await this.userCategoryRepository.deleteUserCategory(userId, categoryId);

      } else if (before[categoryId] === false && after[categoryId] === true) { // 생성

        const firstItemId: Promise<number> = this.itemRepository.getFirstIdEachOfCategory(categoryId);
        this.infoToUserCategoryDB = {
          user_id: userId,
          category_id: categoryId,
          next_item_id: await firstItemId,
        };
        await this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB);

      }

    }
  }


  private extractBooleanInfo(property: ISetCategory): boolean[] {
    const extractedInfo: boolean[] = [];
    for (const key in property) { // 객체 탐색 for...in
        extractedInfo.push(property[key]);
    }
    return extractedInfo;
  }


  private setCategorySelection(data: string[]): void {
    for (const dtype of data) {
      if (dtype === "joke") this.categorySelection.joke = true;
      if (dtype === "compliment") this.categorySelection.compliment = true;
      if (dtype === "condolence") this.categorySelection.condolence = true;
      if (dtype === "scolding") this.categorySelection.scolding = true;
    }
  }


}

export default CategoryService;