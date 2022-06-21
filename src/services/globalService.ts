import schedule from "node-schedule";
import timeHandler from "../common/timeHandler";
import { User } from "../models";
import UserService from "./user/userService";
import { ISetTodayWal } from "../dto/request/userRequest";

class GlobalService extends UserService {

  constructor(
    protected readonly userCategoryRepository: any,
    protected readonly itemRepository: any,
    private readonly todayWalRepository: any,
    private readonly userRepository: any,
    private readonly timeRepository: any,
    private readonly logger: any
  ) {
    super(
      userCategoryRepository,
      itemRepository
    )
  }

  /**
   *  @desc 매일 00시 왈소리 세팅
   *  @access public
   */

  public updateAtNoonEveryDay() {

    this.logger.appLogger.log({ level: "info", message: "✅ scheduler 등록 완료" });
    
    schedule.scheduleJob("0 0 0 * * *", async() => {

      try {

        await this.todayWalRepository.deleteAll();
        await this.updateAllUserTodayWal();
        this.logger.appLogger.log({ level: "info", message: "🐶 오늘의 왈 업데이트" });
        
      } catch(error) {
        this.logger.appLogger.log({ level: "error", message: error.message });
        throw error;
      }
    });

  }

  /**
   *  @desc 모든 유저 탐색 후 오늘의 왈소리 세팅
   *  @access private
   */

  private async updateAllUserTodayWal() {

    try {
      // 설정 완료된 유저들 가져오기
      const isInitUserIds = await this.timeRepository.getAllUserIds() as number[];
      // 유저들의 시간, 예약 정보 가져오기
      const userAndTimeAndReserveInfo = await this.userRepository.getUserTimeReserveInfo(isInitUserIds) as User[];

      for (const userInfo of userAndTimeAndReserveInfo) {

        const selectedTime: Date[] = [];
        const timeInfo = userInfo.getDataValue("time");

        if (timeInfo.getDataValue("morning")) selectedTime.push(timeHandler.getMorning());
        if (timeInfo.getDataValue("afternoon")) selectedTime.push(timeHandler.getAfternoon());
        if (timeInfo.getDataValue("night")) selectedTime.push(timeHandler.getNight());

        const userId = userInfo.getDataValue("id") as number;
        for (const time of selectedTime) {

          const currentItemId = await this.getRandCategoryCurrentItem(userId);
          const data: ISetTodayWal = {
            user_id: userId,
            item_id: currentItemId,
            time
          };
          // 유저가 선택한 시간대에 오늘의 왈소리 세팅
          await this.todayWalRepository.setTodayWal(data);

        }

        const reserveInfo = userInfo.getDataValue("reservations");
        if (reserveInfo.length !== 0) { // 유저가 예약해둔 왈소리가 있으면

          for (const reserve of reserveInfo) {
  
            const currentDate = timeHandler.toUtcTime(reserve.sendingDate).toISOString().split("T")[0];
            if (currentDate == timeHandler.getCurrentDate()) { // 예약해둔 왈소리 날짜와 업데이트 시점 현재 날짜와 같으면

              const data: ISetTodayWal = {
                user_id: userId,
                reservation_id: reserve.id,
                time: reserve.sendingDate,
                userDefined: true
              };
              await this.todayWalRepository.setTodayWal(data)

            }
  
          }
        }

      }

    } catch(error) {
      throw error;
    }

  }

}

export default GlobalService;