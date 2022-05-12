import { Item, Time, User, UserCategory, TodayWal, Reservation } from "../../models";
import {  messageQueue } from './';
import { Job, DoneCallback } from "bull";
import dayjs from "dayjs";
import { messageFunc } from "./messageConsumer";
import logger from "../../api/middlewares/logger";

async function getTokenMessage(time: Date, userId: number) {

    try {
        
        const wal = await TodayWal.findOne({
            where: { time: time, user_id: userId },
            include: [
              { model: User, attributes: ["fcmtoken"] }
            ]
          });
          
        const fcmtoken = wal?.getDataValue("user").getDataValue("fcmtoken");

        const item = await Item.findOne({
            where: {id: wal?.getDataValue("item_id")}
        })
        const content = item?.content;
       
        
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
    try {

        const userId = job.data;

        const dateString = dayjs(new Date()).format("YYYY-MM-DD");

        const data = await getTokenMessage(new Date(`${dateString} 08:00:00`), userId);
       // data : { fcm, content }
        await messageQueue.add(data, { //message를 보내는 작업, 5번 시도
            attempts: 5
        });

        await messageQueue.process(messageFunc)
        done();

    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
    }

}



export const afterFunc = async (job: Job, done: DoneCallback) => {
        try {

            const userId = job.data;
    
            const dateString = dayjs(new Date()).format("YYYY-MM-DD");

            const data = await getTokenMessage(new Date(`${dateString} 14:00:00`), userId);

            await messageQueue.add(data, { //message를 보내는 작업, 5번 시도
                attempts: 5
            });
    
            await messageQueue.process(messageFunc)

            done();
    
        } catch (err) {
            logger.appLogger.log({ level: "error", message: err.message });
        }
    
}

export const nightFunc = async (job: Job, done: DoneCallback) => {
    try {

        const userId = job.data;

        const dateString = dayjs(new Date()).format("YYYY-MM-DD");

        const data = await getTokenMessage(new Date(`${dateString} 20:00:00`), userId);

        await messageQueue.add(data, { //message를 보내는 작업, 5번 시도
            attempts: 5
        });

        await messageQueue.process(messageFunc)
      
        done();

    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
    }

}
////////////////////////////////////////////////////////////////////////
///모르겠다!!!!!!!!!!!!!!!!!!!!!
export const reservationFunc = async (job: Job, done: DoneCallback) => {
    try {

        const reservationId = job.data;

        const reservation = await Reservation.getReservationById(reservationId);

        const userId = reservation?.getDataValue("user_id") as number;
        const content = reservation?.getDataValue("content") as String;
        const date = reservation?.getDataValue("sendingDate") as Date;

        const fcmtoken = await User.getFCMToken(userId);
        const data = {
            fcmtoken,
            content
        }

       //todayWal에 추가하는 부분 만들기!!!!!!!!!!!!이건 시뱅.. 이건.. 그날 자정에 schedule해야 하는..? 아니면 해당 날짜 자정마다 반복하는 reservation queue job add후 삭제 되려나 모르겠음

       await TodayWal.create({
           user_id: userId,
           content,
           time: date,
           userDefined: true,
           reservation_id: reservationId
       })
       
       //밑의 미친 cron식은 당연히 안되더라구요..
        await messageQueue.add(data, { //message를 보내는 작업, 5번 시도
            attempts: 5,
            repeat: { cron: `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`}
        });

        await messageQueue.process(messageFunc)
        done();

    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
    }

}
