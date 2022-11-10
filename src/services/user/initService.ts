import { Service } from "typedi";
import UserService from "./userService";
import { 
    ISetUserCategory, 
    UserSettingDto, 
    ISetCategory,
    ISetTodayWal } from "../../dto/request/userRequest";
import { UserSettingResponse } from "../../dto/response/userResponse";


@Service()
class InitService extends UserService {

  private infoToUserCategoryDB!: ISetUserCategory; 

  constructor(
    protected readonly itemRepository: any,
    protected readonly userCategoryRepository: any,
    private readonly userRepository: any,
    private readonly timeRepository: any,
    private readonly todayWalRepository: any,
    private readonly timeQueueEvent: any,
    private readonly logger: any
  ) {
    super(
      userCategoryRepository, 
      itemRepository
    );
  }

  /**
   *  @desc 유저_초기_설정
   *  @route POST /user/set-info
   *  @access public
   */
        
  public async initSetInfo( 
    userId: number, 
    request: UserSettingDto
  ): Promise<UserSettingResponse> {

    try { 
      // 초기 알람 시간 설정
      await this.timeRepository.setTime(userId, request.time);
      // 설정한 알람 시간 큐에 추가
      this.timeQueueEvent.emit("addTimeQueue", userId, request.time);
      // 초기 닉네임 설정
      await this.userRepository.setNickname(userId, request.nickname); 
      // 알람 받을 유형 설정
      const dtypeBoolInfo: boolean[] = this.extractBooleanInfo(request.dtype as ISetCategory);
      const selectedIds: number[] = this.extractSelectedCategoryIds(dtypeBoolInfo);
      await this.setUserCategory(selectedIds, userId);
      // todayWals 세팅
      const selectedTimes: Date[] = this.extractSelectedTimes(request.time);
      await this.setTodayWals(selectedTimes, userId);

      return { nickname: request.nickname };

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

  private async setTodayWals(
      selectedTimes: Date[], 
      userId: number
  ): Promise<void> {

    try {

      for (let i = 0; i < selectedTimes.length; i++) {
        const { currentItemId, categoryId } = await this.getRandCategoryCurrentItem(userId);
        const data: ISetTodayWal = {
          userId,
          categoryId,
          itemId: currentItemId,
          time: selectedTimes[i]
        };
        await this.todayWalRepository.setTodayWal(data);
      }
      
    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: `setTodayWals :: ${error.message}` });
      throw error;
    }

  }


  private async setUserCategory(
      selectedIds: number[], 
      userId: number
  ): Promise<void> {

    try {

      for (let index = 0; index < selectedIds.length; index++) {
        const categoryId: number = selectedIds[index];
        const firstItemId: Promise<number> = this.itemRepository.getFirstIdEachOfCategory(categoryId);
        this.infoToUserCategoryDB = {
          userId,
          categoryId,
          nextItemId: await firstItemId,
        };
        await this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB);
      }

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: `setUserCategory :: ${error.message}` });
      throw error;
    }

  }


  private extractSelectedCategoryIds(dtypeBoolInfo: boolean[]): number[] {
    const dtypeIds: number[] = [];
    for (let i = 0; i < dtypeBoolInfo.length; i++) {
      if (dtypeBoolInfo[i] === true) {
        dtypeIds.push(i);
      }
    }
    return dtypeIds;
  }

}



export default InitService;
