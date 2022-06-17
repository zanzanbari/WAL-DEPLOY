import { Service } from "typedi";
import { getRandCategoryCurrentItem } from "../pushAlarm";
import timeHandler from "../../common/timeHandler";
import { ISetTime, ISetTodayWal, ResetTimeDto } from "../../interface/dto/request/userRequest";

@Service()
class TimeService {

  constructor(
    private readonly timeRepository: any,
    private readonly todayWalRepository: any,
    private readonly timeQueueEvent: any,
    private readonly logger: any
  ) {
  }

  /**
   *  @유저_알람시간_수정
   *  @route POST /user/info/time
   *  @access public
   */

  public async resetTimeInfo(
    userId: number,
    request: ResetTimeDto
  ): Promise<ISetTime> {
  
    const beforeSetTime = request[0]; // 이전 설정값
    const afterSetTime = request[1]; // 새로운 설정값

    try {

      await this.timeRepository.updateTime(userId, afterSetTime);
      const updatedTime = this.timeRepository.findById(userId) as Promise<ISetTime>;

      const isCanceledTime: Date[] = this.extractCanceledTime(beforeSetTime, afterSetTime);
      this.setCanceledTime(isCanceledTime, userId);
        
      const isAddedTime: Date[] = this.extractAddedTime(beforeSetTime, afterSetTime);
      this.setAddedTime(isAddedTime, userId);

      return await updatedTime;
        
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

  private async setAddedTime(
    isAddedTime: Date[], 
    userId: number
  ): Promise<void> {

    let addFlag = "add";
    let currentTime: Date = timeHandler.getCurrentTime();
    for (const time of isAddedTime) {
      if (time > currentTime) {
        this.timeQueueEvent.emit("updateUserTime", userId, time, addFlag );
        const currentItemId = await getRandCategoryCurrentItem(userId);
        const data: ISetTodayWal = {
          user_id: userId,
          item_id: currentItemId,
          time
        };
        await this.todayWalRepository.setTodayWal(data);
      }
    }

  }


  private async setCanceledTime(
    isCanceledTime: Date[], 
    userId: number
  ): Promise<void> {

    let cancelFlag = "cancel";
    let currentTime: Date = timeHandler.getCurrentTime();
    for (const time of isCanceledTime) {
      if (time > currentTime) {
        this.timeQueueEvent.emit("updateUserTime", userId, time, cancelFlag );
        await this.todayWalRepository.deleteTodayWal(userId, time);
      }
    }

  }


  private extractAddedTime(
    beforeSetTime: ISetTime, 
    afterSetTime: ISetTime
  ): Date[] {

    const isAddedTime: Date[] = [];
    if (beforeSetTime.morning === false && afterSetTime.morning === true)
      isAddedTime.push(timeHandler.getMorning());
    if (beforeSetTime.afternoon === false && afterSetTime.afternoon === true)
      isAddedTime.push(timeHandler.getAfternoon());
    if (beforeSetTime.night === false && afterSetTime.night === true)
      isAddedTime.push(timeHandler.getNight());
    return isAddedTime;

  }


  private extractCanceledTime(
    beforeSetTime: ISetTime, 
    afterSetTime: ISetTime
  ): Date[] {

    const isCanceledTime: Date[] = [];
    if (beforeSetTime.morning === true && afterSetTime.morning === false)
      isCanceledTime.push(timeHandler.getMorning());
    if (beforeSetTime.afternoon === true && afterSetTime.afternoon === false)
      isCanceledTime.push(timeHandler.getAfternoon());
    if (beforeSetTime.night === true && afterSetTime.night === false)
      isCanceledTime.push(timeHandler.getNight());
    return isCanceledTime;

  }

}

export default TimeService;