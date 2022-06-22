import { Service } from "typedi";
import { 
  ISetCategory, 
  ISetTime, 
  ISetTodayWal, 
  ISetUserCategory, 
  ResetCategoryDto } from "../../dto/request/userRequest";
  import timeHandler from "../../common/timeHandler";
import UserService from "./userService";

@Service()
class CategoryService extends UserService {

  private infoToUserCategoryDB!: ISetUserCategory; 
  private categorySelection: ISetCategory = {
    joke: false,
    compliment: false,
    condolence: false,
    scolding: false
  };

  constructor(
    protected readonly userCategoryRepository: any,
    private readonly todayWalRepository: any,
    private readonly timeRepository: any,
    protected readonly itemRepository: any,
    private readonly logger: any
  ) {
    super(
      userCategoryRepository,
      itemRepository
    )
  }

  /**
   *  @desc 유저_왈소리유형_정보_조회
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
   *  @desc 유저_왈소리유형_정보_수정
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
      // 유저가 설정한 시간대 확인
      const timeInfo = await this.timeRepository.findById(userId) as ISetTime;
      const settedTime: Date[] = this.extractSelectedTimes(timeInfo);
      // 유저가 설정한 시간대와 수정 요청한 현재 시간과 비교, 유저 설정 시간대가 현재 시간 이후일 때 값 축출
      const afterTime: Date[] = this.compareAfterTime(settedTime);
      await this.resetUserCategory(before, after, userId, afterTime);

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
    userId: number,
    afterTime: Date[]
  ): Promise<void> {

    try {

      for (let categoryId = 0; categoryId < 4; categoryId++) {
  
        if (before[categoryId] === true && after[categoryId] === false) { // 삭제
  
          for (const time of afterTime) { // 현재 시간 이후에 받을 왈소리에 삭제된 유형이 있다면
            await this.todayWalRepository.deleteTodayWal(userId, time, categoryId); // 찾아서 삭제
          }
          await this.userCategoryRepository.deleteUserCategory(userId, categoryId);
  
        } else if (before[categoryId] === false && after[categoryId] === true) { // 생성
          
          const firstItemId: Promise<number> = this.itemRepository.getFirstIdEachOfCategory(categoryId);
          this.infoToUserCategoryDB = {
            userId,
            categoryId,
            nextItemId: await firstItemId, // 새로 생성한 유형의 첫번째 item
          };
          await this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB);

          for (const time of afterTime) { // 현재 시간 이후에 받을 왈소리에 추가된 유형이 있다면
            const { currentItemId, categoryId } = await this.getRandCategoryCurrentItem(userId);
            const data: ISetTodayWal = {
              userId,
              categoryId,
              itemId: currentItemId, 
              time
            };
            console.log(data);
            await this.todayWalRepository.setTodayWal(data); // 왈소리 세팅
          }


        }
  
      }
      
    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: `resetUserCategory :: ${error.message}` });
    }

  }


  private compareAfterTime(settedTime: Date[]): Date[] {
    const afterTime: Date[] = [];
    for (const time of settedTime) {
      if (time > timeHandler.getCurrentTime()) {
        afterTime.push(time);
      }
    }
    return afterTime;
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