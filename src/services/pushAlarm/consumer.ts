import { Job, DoneCallback } from "bull";
import { messageQueue } from ".";
import { messageProcess } from "./messageConsumer";
import logger from "../../loaders/logger";
import timeHandler from "../../common/timeHandler";
import { Item, Reservation, TodayWal } from "../../models";

/**
 *  @desc 아침 큐 process
 *  @access public
 */

export const morningProcess = async (job: Job, done: DoneCallback) => {

  logger.appLogger.log({ level: "info", message: "morning queue process START" });

  try {

    const userId = job.data;
    const data = await getFcmAndContent(userId, timeHandler.getMorning());
    // data : { fcm, content }
    await messageQueue.add("morning-message",data, { attempts: 5 }); //message를 보내는 작업, 5번 시도
    logger.appLogger.log({ level: "info", message: "morning messageQueue 등록 성공" });
    messageQueue.process("morning-message",messageProcess);
    done();

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
  }

}

/**
 *  @desc 점심 큐 process
 *  @access public
 */

export const afterProcess = async (job: Job, done: DoneCallback) => {

  logger.appLogger.log({ level: "info", message: "afternoon queue process START" });

  try {

    const userId = job.data;
    const data = await getFcmAndContent(userId, timeHandler.getAfternoon());

    await messageQueue.add("afternoon-message",data, { attempts: 5 });
    logger.appLogger.log({ level: "info", message: "afternoon messageQueue 등록 성공" });
    messageQueue.process("afternoon-message",messageProcess)
    done();
    
  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
  }
    
}

/**
 *  @desc 저녁 큐 process
 *  @access public
 */

export const nightProcess = async (job: Job, done: DoneCallback) => {

  logger.appLogger.log({ level: "info", message: "night queue process START" });

  try {

    const userId = job.data;
    const data = await getFcmAndContent(userId, timeHandler.getNight());
    console.log(data);

    await messageQueue.add("night-message",data, { attempts: 5 });
    logger.appLogger.log({ level: "info", message: "night messageQueue 등록 성공" });
    messageQueue.process("night-message",messageProcess);
    done();

  } catch (error) {
    logger.appLogger.log({ level: "error", message: `nightProcess::${error.message}` });
  }

}

/**
 *  @desc 예약 큐 process
 *  @access public
 */

export const reserveProcess = async (job: Job, done: DoneCallback) => {

  logger.appLogger.log({ level: "info", message: "reserve queue process START" });

  try {

    const userId = job.data;
    const data = await getFcmAndContent(userId);

    await messageQueue.add("reserve-message",data, { attempts: 5 });
    logger.appLogger.log({ level: "info", message: "reserve messageQueue 등록 성공" });
    messageQueue.process("reserve-message",messageProcess);
    done();

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
  }

}

/**
 *  @desc 유저의 fcmtoken 과 보내줄 content 가져오기
 *  @time 정해진 시간대 "아침, 점심, 저녁" | 예약일 경우 없음
 *  @access public
 */

async function getFcmAndContent(userId: number, time?: Date): Promise<{
  fcmtoken: string;
  content: string;
  isReserved: boolean;
}> {

  try {

    if (time) { 

      const { fcmtoken, itemId } = await TodayWal.getFcmByUserId(userId, time) as { fcmtoken: string, itemId: number };
      const { content } = await Item.getContentById(itemId) as { content: string };
      return { fcmtoken, content, isReserved: false };

    } else { // reservation

      const { fcmtoken, reservationId } = await TodayWal.getFcmByUserId(userId)as { fcmtoken: string, reservationId: number };
      const content = await Reservation.getContentById(reservationId) as string;
      return { fcmtoken, content, isReserved: true };

    }

  } catch (error) {
    logger.appLogger.log({ level: "error", message: `getFcmAndContent :: ${error.message}` });
    throw error;
  }

}



/**
 * ######################################
 * * ERROR
 * * private method                         
 * * getFcmAndContent is not a function
 * * & logger 주입 인식 오류
 * ######################################
 */
// class Consumer {

//   constructor(
//     private readonly todayWalRepository: any,
//     private readonly reserveRepository: any,
//     private readonly itemRepository: any,
//     private readonly messageQueue: any,
//     private readonly logger: any
//   ) {
//   }

//   public async processMorning(job: Job, done: DoneCallback) {

//     try {

//       const userId = job.data;
//       const data = await this.getFcmAndContent(userId, timeHandler.getMorning());

//       await this.messageQueue.add(data, { attempts: 5 });
//       this.messageQueue.process(messageFunc);
//       done();

//     } catch (error) {
//       this.logger.appLogger.log({ level: "error", message: error.message });
//       throw error;
//     }

//   }


//   public async processAfternoon(job: Job, done: DoneCallback) {

//     try {

//       const userId = job.data;
//       const data = await this.getFcmAndContent(userId, timeHandler.getAfternoon());

//       await this.messageQueue.add(data, { attempts: 5 });
//       this.messageQueue.process(messageFunc);
//       done();

//     } catch (error) {
//       this.logger.appLogger.log({ level: "error", message: error.message });
//       throw error;
//     }

//   }


//   public async processNight(job: Job, done: DoneCallback) {

//     try {

//       const userId = job.data;
//       const data = await this.getFcmAndContent(userId, timeHandler.getNight()) as { fcmtoken: string, content: string;};

//       await this.messageQueue.add(data, { attempts: 5 });
//       this.messageQueue.process(messageFunc);
//       done();

//     } catch (error) {
//       // this.logger.appLogger.log({ level: "error", message: error.message });
//       console.log(error.message);
//       throw error;
//     }

//   }


//   public async processReserve(job: Job, done: DoneCallback) {

//     try {

//       const userId = job.data;
//       const data = await this.getFcmAndContent(userId);

//       await this.messageQueue.add(data, { attempts: 5 });
//       this.messageQueue.process(messageFunc);
//       done();

//     } catch (error) {
//       this.logger.appLogger.log({ level: "error", message: error.message });
//       throw error;
//     }

//   }



//   private async getFcmAndContent(userId: number, time?: Date) {

//     try {

//       if (time) { 

//         const { fcmtoken, itemId } = await this.todayWalRepository.getFcmByUserId(userId, time) as { fcmtoken: string, itemId: number };
//         console.log(fcmtoken);
//         console.log(itemId);
//         const { content } = await this.itemRepository.getContentById(itemId) as { content: string };
//         console.log(content);
//         return { fcmtoken, content };

//       } else { // reservation

//         const { fcmtoken, reservationId } = await this.todayWalRepository.getFcmByUserId(userId)as { fcmtoken: string, reservationId: number };
//         const content = await this.reserveRepository.getContentById(reservationId) as string;
//         return { fcmtoken, content };

//       }

//     } catch (error) {
//       this.logger.appLogger.log({ level: "error", message: `getFcmAndContent :: ${error.message}` });
//       throw error;
//     }

//   }

// }

// export default Consumer;