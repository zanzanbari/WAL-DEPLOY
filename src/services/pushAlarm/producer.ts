import timeHandler from '../../common/timeHandler';
import { ISetTime } from '../../dto/request/userRequest';

class Producer {

  constructor(
    private readonly morningQueue: any,
    private readonly afternoonQueue: any,
    private readonly nightQueue: any,
    private readonly reserveQueue: any,
    private readonly processEvent: any,
    private readonly logger: any
  ) {
  }

  /**
   *  @desc 유저가 설정한 시간대에 큐 추가
   *  @access public
   */

  public async addTimeQueue(userId: number, time: ISetTime) {

    try {

      if (time.morning) this.addQueueAndEmitConsumer("morning", userId);
      if (time.afternoon) this.addQueueAndEmitConsumer("afternoon", userId);
      if (time.night) this.addQueueAndEmitConsumer("night", userId);

    } catch(error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
    }

  }

  /**
   *  @desc 유저가 설정 시간 추가 변경 했을 때 해당 시간 큐에 추가
   *  @access public
   */

  public async updateAddTimeQueue(userId: number, time: Date): Promise<void> {

    try {

      if (time.getTime() == timeHandler.getMorning().getTime()) this.addQueueAndEmitConsumer("morning", userId);
      if (time.getTime() == timeHandler.getAfternoon().getTime()) this.addQueueAndEmitConsumer("afternoon", userId);
      if (time.getTime() == timeHandler.getNight().getTime()) this.addQueueAndEmitConsumer("night", userId);

    } catch(error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
    }

  }

  /**
   *  @desc 유저가 설정 시간 삭제 변경 했을 때 해당 시간 큐에서 제거
   *  @access public
   */

  public async updateCancelTimeQueue(userId: number,time: Date): Promise<void> {

    try {

      if (time.getTime() == timeHandler.getMorning().getTime()) {
        await this.morningQueue.removeRepeatable("morning", { 
          cron: "0 0 8 * * *", 
          jobId: userId 
        });
      }
      if (time.getTime() == timeHandler.getAfternoon().getTime()) {
        await this.afternoonQueue.removeRepeatable("afternoon", { 
          cron: "0 0 14 * * *", 
          jobId: userId 
        });
      }
      if (time.getTime() == timeHandler.getNight().getTime()) {
        await this.nightQueue.removeRepeatable("night", { 
          cron: "0 0 20 * * *", 
          jobId: userId 
        });
      }

    } catch(error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
    }

  }

  /**
   *  @desc 예약 큐 추가
   *  @date 2022-06-21 형식
   *  @time 20:30:00 형식
   *  @access public
   */

  public async addReservationQueue(
    userId: number,
    date: string,
    time: string
  ): Promise<void> {

    const sepDate = date.split("-");
    const month = this.removeZero(sepDate[1]);
    const day = this.removeZero(sepDate[2]);

    const sepTime = time.split(":");
    const hour = this.removeZero(sepTime[0]);
    const min = this.removeZero(sepTime[1]);

    try {

      await this.reserveQueue.add("reserve", userId, {
        jobId: userId,
        repeat: { cron: `0 ${min} ${hour} ${day} ${month} *` },
        removeOnComplete: true
      });
      this.processEvent.emit("reserveProcess");

    } catch(error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
    }

  }

  /**
   *  @desc 예약 큐 제거
   *  @date 2022-06-21T20:00:00.0000Z 형식
   *  @access public
   */

  public async cancelReservationQueue(userId: number, date: Date): Promise<void> {

    const utcDate = timeHandler.toUtcTime(date);
    const strDate = utcDate.toISOString().split("T");

    const sepDate = strDate[0];
    const month = this.removeZero(sepDate.split("-")[1]);
    const day = this.removeZero(sepDate.split("-")[2]);
    
    const sepTime = strDate[1];
    const hour = this.removeZero(sepTime.split(":")[0]);
    const min = this.removeZero(sepTime.split(":")[1]);

    try {

      await this.reserveQueue.removeRepeatable("reserve", { 
        cron: `0 ${min} ${hour} ${day} ${month} *`, 
        jobId: userId 
      });

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
    }

  }

  /**
   *  @desc 큐 추가 및 process 이벤트 emit
   *  @access private
   */

  private async addQueueAndEmitConsumer(time: string, userId: number) {

    try {
  
      switch (time) {
  
        case "morning":
          await this.morningQueue.add("morning", userId, {
            jobId: userId,
            repeat: { cron: "0 0 8 * * *" }
          });
          this.processEvent.emit("morningProcess");
          break;
  
        case "afternoon":
          await this.afternoonQueue.add("afternoon", userId, {
            jobId: userId,
            repeat: { cron: "0 0 14 * * *" }
          });
          this.processEvent.emit("afternoonProcess");
          break;
  
        case "night":
          await this.nightQueue.add("night", userId, {
            jobId: userId,
            repeat: { cron: "0 0 20 * * *" }
          });
          this.processEvent.emit("nightProcess");
          break;
  
      }
  
    } catch(error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
    }
  
  }

  /**
   *  @desc cron 형식에 01 ~ 09 불가능하므로 0 제거
   *  @access private
   */

  private removeZero(element: string): string {

    if (element.split("")[0] === "0") {
      return element.split("")[1];
    } else {
      return element;
    }

  }

}


export default Producer;