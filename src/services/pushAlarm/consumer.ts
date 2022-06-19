import { Item, User, TodayWal, Reservation } from "../../models";
import {  messageQueue } from './';
import { Job, DoneCallback } from "bull";
import dayjs from "dayjs";
import { messageFunc } from "./messageConsumer";
import logger from "../../loaders/logger";

async function getTokenMessage(time: Date, userId: number) {

  try {
        
    const wal = await TodayWal.findOne({
      where: { time: time, user_id: userId },
      include: [
        { model: User, attributes: ["fcmtoken"] }
      ]
    });
      
    const fcmtoken = wal?.getDataValue("user").getDataValue("fcmtoken");
    const userDefined = wal?.getDataValue("userDefined");
    let content:string|undefined = "";
    if (userDefined) {
      const reservation = await Reservation.findOne({
        where: {id: wal?.getDataValue("reservation_id")}
      });
      content = reservation?.content;
    } else {
      const item = await Item.findOne({
        where: {id: wal?.getDataValue("item_id")}
      });
      content = item?.content;
    }

    const data = {
      fcmtoken,
      content
    };
      
    return data;

  } catch (err) {
    logger.appLogger.log({ level: "error", message: err.message });
  }
    
}



export const morningFunc = async (job: Job, done: DoneCallback) => {

  logger.appLogger.log({ level: "info", message: `morningFunc process START` });
  
  try {
    
    const userId = job.data;
    const dateString = dayjs(new Date()).format("YYYY-MM-DD");
    const data = await getTokenMessage(new Date(`${dateString} 08:00:00`), userId);
    // data : { fcm, content }
    await messageQueue.add(data, { attempts: 5 }); //message를 보내는 작업, 5번 시도
    logger.appLogger.log({ level: "info", message: `유저 ${userId} : ${job.id}: messageQueue 등록 성공` });
    messageQueue.process(messageFunc);
    done();

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
  }

}



export const afterFunc = async (job: Job, done: DoneCallback) => {

  logger.appLogger.log({ level: "info", message: `afterFunc process START` });

  try {

    const userId = job.data;
    const dateString = dayjs(new Date()).format("YYYY-MM-DD");
    const data = await getTokenMessage(new Date(`${dateString} 14:00:00`), userId);

    await messageQueue.add(data, { attempts: 5 });
    logger.appLogger.log({ level: "info", message: `유저 ${userId} : ${job.id} : messageQueue 등록 성공` });
    messageQueue.process(messageFunc);
    done();
    
  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
  }
    
}

export const nightFunc = async (job: Job, done: DoneCallback) => {

  logger.appLogger.log({ level: "info", message: `nightFunc process START` });

  try {

    console.log("나 실행한다")
    const userId = job.data;
    const dateString = dayjs(new Date()).format("YYYY-MM-DD");
    const data = await getTokenMessage(new Date(`${dateString} 20:00:00`), userId);

    await messageQueue.add(data, { attempts: 5 });
    logger.appLogger.log({ level: "info", message: `유저 ${userId} : ${job.id}: messageQueue 등록 성공` });
    messageQueue.process(messageFunc);
    done();

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
  }

}
