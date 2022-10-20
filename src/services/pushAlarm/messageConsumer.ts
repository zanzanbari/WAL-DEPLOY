import { Job, DoneCallback } from "bull";
import logger from "../../loaders/logger";
import { Reservation } from "../../models";
import { firebaseApp } from "../../loaders/firebase";

export const messageProcess = async (job: Job, done: DoneCallback) => {

  logger.appLogger.log({ level: "info", message: "message queue process START"});

  try {
    const { fcmtoken, content, isReserved } = job.data;

    const message = { 
      notification: { 
        title: '왈',
        body: content,
      }, 
      token: fcmtoken, 
    };


    firebaseApp 
      .messaging()
      .send(message) 
      .then(async response => {

        logger.appLogger.log({
          level: 'info',
          message: `📣 Successfully sent message: : ${response} ${content} ${job.id}`
        });
        if (isReserved) {
          await Reservation.update({
            completed: true
          }, {
            where: { content }
          });
          logger.appLogger.log({ level: "info", message: "예약 왈소리 전송완료"});
        }
        
      })
      .catch(error => { 

        logger.appLogger.log({
          level: 'error',
          message: `❌ SENDING MESSAGE ERROR :: ${error.message}`
        });
      });

    done();

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
  }

}
