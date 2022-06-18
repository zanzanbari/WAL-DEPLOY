import dayjs from "dayjs";
import { Reservation } from "../../models";
import { IReserveData } from "../../dto/response/reserveResponse";
import { ISetReserveDto } from "../../dto/request/reserveRequest";
import customError from "../../constant/responseError";

class ReserveService {

  constructor(
    private readonly reserveRepository: any,
    private readonly logger: any
  ) {
  }

  /**
  *  @예약한_왈소리_히스토리
  *  @route GET /reserve
  *  @access public
  */

  public async getReservation(
    userId: number
  ): Promise<"NO_RESERVATION" | {
    sendingData: IReserveData[];
    completeData: IReserveData[];
  }> {

    try {

      const sendingData: IReserveData[] = [];
      const completeData: IReserveData[] = [];

      const beforeSendItems = await this.reserveRepository.getSendingItems(userId) as Reservation[];
      const alreadySendItems = await this.reserveRepository.getCompletedItems(userId) as Reservation[];;

      if (beforeSendItems.length < 1 && alreadySendItems.length < 1) return "NO_RESERVATION";

      await this.pushEachItems(sendingData, beforeSendItems, false);
      await this.pushEachItems(completeData, alreadySendItems, true);

      return { sendingData, completeData };

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

  /**
   *  @왈소리_만들기
   *  @route POST /reserve
   *  @access public
   */

  public async postReservation(
    userId: number, 
    request: ISetReserveDto
  ): Promise<number | { postId: number }> {

    try {

      const existingDate = await this.reserveRepository.getReservationByDate(userId, request.date);
      if (existingDate) return customError.ALREADY_RESERVED_DATE;

      const newReservationId = await this.reserveRepository.setReservation(userId, request) as number;

      /**
       * ----------
       * 알람 큐 추가
       * ----------
       */

      return { postId: newReservationId };
   
    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

  /**
   *  @예약한_왈소리_날짜_확인
   *  @route GET /reserve/datepicker
   *  @access public
   */

  public async getReservationOnCalender(userId: number): Promise<string[] | "NO_RESERVATION_DATE"> {

    try {

      const reservedDateItems = await this.reserveRepository.getReservationsFromTomorrow(userId);
      if (reservedDateItems.length < 1) return "NO_RESERVATION_DATE";

      console.log("=============");
      console.log(reservedDateItems);
      console.log("=============");

      const date: string[] = [];
      for (const item of reservedDateItems) {
        const reservedDate = item.getDataValue("sendingDate") as Date;
        date.push(dayjs(reservedDate).format("YYYY-MM-DD"));
      }

      return date.sort();

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

  /**
   *  @왈소리_예약_취소
   *  @route DELETE /reserve/:postId
   *  @access public
   */

  public async removeReservation(userId: number, postId: number) {

    try {

      const waitingReservation = await this.reserveRepository.getReservationByPostId(userId, postId, false);
      if (!waitingReservation) return customError.NO_OR_COMPLETED_RESERVATION;

      /**
       * --------------------------------
       * schedule에서 해당 reservation 삭제
       * --------------------------------
       */

      await waitingReservation?.destroy();

      return { postId };

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

  /**
   *  @전송된_왈소리_히스토리_삭제
   *  @route DELETE /reserve/completed/:postId
   *  @access public
   */

  public async removeReservationHistory(userId: number, postId: number) {

    try {

      const completedReservation = await this.reserveRepository.getReservationByPostId(userId, postId, true);
      if (!completedReservation) return customError.NO_OR_UNCOMPLETED_RESERVATION;

      await completedReservation?.destroy();

      return { postId };

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

  private async getHistoryDateMessage(rawDate: Date) {

    try {

      const date = dayjs(rawDate);

      const monthDate = date.format("MM. DD") as string;
      let time = date.format(":mm") as string;

      if (date.hour() > 12) {
        time = ` 오후 ${date.hour() - 12}` + time;
      } else {
        time = ` 오전 ${date.hour()}` + time;
      }

      const dayOfWeek = ["(일)", "(월)", "(화)", "(수)", "(목)", "(금)", "(토)"];
      const day = dayOfWeek[date.day()] as string;

      return { monthDate, day, time };

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

  private async pushEachItems(
    dataArr: IReserveData[],
    Items: Reservation[],
    completed: boolean
  ): Promise<void> {

    try {

      for (const item of Items) {

        const rowDate = item.getDataValue("sendingDate") as Date;
        const historyMessage = await this.getHistoryDateMessage(rowDate);

        const sendingDate = 
          historyMessage.monthDate + " " + 
          historyMessage.day + 
          historyMessage.time + 
          (!completed ? " • 전송 예정" : " • 전송 완료");

        const reserveData: IReserveData = {
          postId: item.id,
          sendingDate,
          content: item.getDataValue("content"),
          reserveAt: dayjs(item.getDataValue("reserveAt")).format("YYYY. MM. DD"),
          ...(!completed && { hidden: item.getDataValue("hide") })
        };

        dataArr.push(reserveData);

      }
    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

}

export default ReserveService;