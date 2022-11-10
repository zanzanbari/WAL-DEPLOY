import { Service } from "typedi";
import { TodayWal } from "../../models";
import timeHandler from "../../common/timeHandler";
import { IMainResponse } from "../../dto/response/mainResponse";

@Service()
class MainService {

  constructor(
    private readonly todayWalRepository: any,
    private readonly reservationRepository: any,
    private readonly itemRepository: any,
    private readonly subtitleRepository: any,
    private readonly todaySubtitleRepository: any,
    private readonly logger: any
  ) {
  }

  /**
   *  @desc 메인화면
   *  @route GET /main
   *  @access public
   */

  public async getMain(userId: number){

    try {

      const subtitle: string = await this.getTodaySubtitle();

      const todayWals: TodayWal[] = await this.todayWalRepository.getTodayWalsByUserId(userId);
      const todayWal: IMainResponse[] = await this.getMainResult(todayWals);

      return  {subtitle, todayWal};
      
    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }


  public async updateShown(userId: number, mainId: number) {
    try {

      const subtitle: string = await this.getTodaySubtitle();

      const todayWals: TodayWal[] = await this.todayWalRepository.updateShown(userId, mainId);
      const todayWal: IMainResponse[] = await this.getMainResult(todayWals);

      return {subtitle, todayWal};
      
    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }
  }

  private async getTodaySubtitle(): Promise<string> {
    try {

      const subtitleId: Promise<number> = await this.todaySubtitleRepository.getTodaySubtitle();
      const content: Promise<string> = await this.subtitleRepository.getContentById(subtitleId);
      return content;
      
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

  private async getMainResult(todayWals: TodayWal[]): Promise<IMainResponse[]> {

    const result: IMainResponse[] = [];

    try {

      for (const todayWal of todayWals) {

        const id: number = todayWal.getDataValue("id");
        const isShown: boolean = todayWal.getDataValue("isShown");

        let mainResponse: IMainResponse = {
          id,
          type: "default",
          content: "default",
          canOpen: false,
          categoryId: -1,
          isShown,
          voice: ""
        };
        const time: Date = todayWal.getDataValue("time");
        mainResponse.canOpen = timeHandler.getCurrentTime().getTime() >= time.getTime() ? true : false;

        if (todayWal.getDataValue("userDefined")) { // 직접 예약한 왈소리라면

          const reservationId: number = todayWal.getDataValue("reservationId");
          const content: Promise<string> = this.reservationRepository.getContentById(reservationId);

          mainResponse.type = "스페셜";
          mainResponse.content = await content;

        } else { // 직접 예약한 왈소리가 아니라면
          
          const itemId: number = todayWal.getDataValue("itemId");
          const { content, categoryId, voice } = await this.itemRepository.getContentById(itemId);
          mainResponse.content = content;
          mainResponse.categoryId = categoryId;
          if (voice) mainResponse.voice = voice;


          if (time.getTime() === timeHandler.getMorning().getTime()) mainResponse.type = "아침";
          if (time.getTime() === timeHandler.getAfternoon().getTime()) mainResponse.type = "점심";
          if (time.getTime() === timeHandler.getNight().getTime()) mainResponse.type = "저녁";

        }
        result.push(mainResponse);
      }
      return result;

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: `getMainResult :: ${error.message}` });
      throw error;
    }

  }

};

export default MainService;