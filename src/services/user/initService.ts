import { Service } from "typedi";
import { getRandCategoryCurrentItem } from "../pushAlarm";
import { addUserTime } from "../pushAlarm/producer";
import timeHandler from "../../common/timeHandler";
import { 
    ISetUserCategory, 
    UserSettingDto, 
    ISetCategory,
    ISetTodayWal, 
    ISetTime } from "../../interface/dto/request/userRequest";
import { UserSettingResponse } from "../../interface/dto/response/userResponse";


@Service()
class InitService {

  private infoToUserCategoryDB!: ISetUserCategory; 

  constructor(
    private readonly userRepository: any,
    private readonly timeRepository: any,
    private readonly itemRepository: any,
    private readonly userCategoryRepository: any,
    private readonly todayWalRepository: any,
    private readonly logger: any
  ) {
  }

  /**
   *  @유저_초기_설정
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
      addUserTime(userId);
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

    for (let i = 0; i < selectedTimes.length; i++) {
      const currentItemId = getRandCategoryCurrentItem(userId);
      const data: ISetTodayWal = {
        user_id: userId,
        item_id: await currentItemId,
        time: selectedTimes[i]
      };
      await this.todayWalRepository.setTodayWal(data);
    }

  }


  private extractSelectedTimes(time: ISetTime): Date[] {
    const timeSelection: Date[] = [];
    if (time.morning == true)
      timeSelection.push(timeHandler.getMorning());
    if (time.afternoon == true)
      timeSelection.push(timeHandler.getAfternoon());
    if (time.night == true)
      timeSelection.push(timeHandler.getNight());
    return timeSelection;
  }


  private async setUserCategory(
      selectedIds: number[], 
      userId: number
  ): Promise<void> {

    for (let index = 0; index < selectedIds.length; index++) {
      const categoryId: number = selectedIds[index];
      const firstItemId: Promise<number> = this.itemRepository.getFirstIdEachOfCategory(categoryId);
      this.infoToUserCategoryDB = {
        user_id: userId,
        category_id: categoryId,
        next_item_id: await firstItemId,
      };
      await this.userCategoryRepository.setUserCategory(this.infoToUserCategoryDB);
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

  /**
   *  @Bool값_추출
   *  @desc 유저가 선택한 유형(category) 확인하기 위해
   *  @access private
   */

  private extractBooleanInfo(property: ISetCategory): boolean[] {
    const extractedInfo: boolean[] = [];
    for (const key in property) { // 객체 탐색 for...in
      extractedInfo.push(property[key]);
    }
    return extractedInfo;
  }


}



export default InitService;