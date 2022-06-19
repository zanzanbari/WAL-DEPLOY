import { morningQueue, afternoonQueue, nightQueue } from './';
import {morningFunc, afterFunc, nightFunc} from './consumer';
import { Time } from "../../models";
import logger from "../../loaders/logger";
import timeHandler from '../../common/timeHandler';

 /**
 *  @시간정보_큐에_추가
 *  @desc
 *  @flag_0 : morning
 *  @flag_1 : afternoon
 *  @flag_2 : night
 */

async function addTimeQueue(userId: number, flag: number): Promise<void> {

  try {
    switch (flag) {

      case 0:
        await morningQueue.add("morning",userId, {
          jobId: userId,
          repeat: { cron: `0 0 8 * * *` }
        });
        logger.appLogger.log({level: "info", message: `유저 ${userId} :: morningQueue 등록 성공`});
        morningQueue.process("morning",morningFunc);
        break;

      case 1:
        await afternoonQueue.add("afternoon",userId, {
          jobId: userId,
          repeat: { cron: `0 0 14 * * *` }
        });
        logger.appLogger.log({level: "info", message: `유저 ${userId} :: afternoonQueue 등록 성공`});
        afternoonQueue.process("afternoon",afterFunc);
        break;

      case 2:
        await nightQueue.add("night",userId, { 
          jobId: userId,
          repeat: { cron: `0 0 18 * * *` }
        });
        logger.appLogger.log({level: "info", message: `유저 ${userId} :: nightQueue 등록 성공`});
        nightQueue.process("night",nightFunc);
        break;

    }

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
    throw error;
  }
}

export async function addUserTime(userId: number): Promise<void> {

  try {
    //user id를 data로 전달
    const times = await Time.findOne({
      where: { user_id : userId }
    }) as Time;

    if (times.morning) addTimeQueue(userId, 0);
    if (times.afternoon) addTimeQueue(userId, 1);
    if (times.night) addTimeQueue(userId, 2);

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
    throw error;
  }
    
}
//user 세팅 수정 시 특정 조건에 걸리면 이 함수 실행
export async function updateUserTime(
    userId: number, 
    time: Date, 
    flag: string
): Promise<void> {
//time: morning, afternoon, night
//flag: add, delete
  try {
    if (flag == "add") {

      if (time == timeHandler.getMorning()) addTimeQueue(userId, 0);
      if (time == timeHandler.getAfternoon()) addTimeQueue(userId, 1);
      if (time == timeHandler.getNight()) addTimeQueue(userId, 2);

    } else if (flag == "cancel") {

      if (time == timeHandler.getMorning()) {
        await morningQueue?.removeRepeatable("morning",{ cron: `* 8 * * *` , jobId: userId});
      } 
      else if (time == timeHandler.getAfternoon()) {  
        await afternoonQueue?.removeRepeatable("afternoon",{ cron: `* 14 * * *` , jobId: userId});
      } 
      else if (time == timeHandler.getNight()) {
        await nightQueue?.removeRepeatable("night",{ cron: `* 20 * * *` , jobId: userId});
      }

    }
        
  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
    throw error;
  }
    
}
