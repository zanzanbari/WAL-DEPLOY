import { Reservation } from "../../models";
import { Job, DoneCallback } from "bull";
import { firebaseApp } from "../../loaders/firebase";
import logger from "../../loaders/logger";

export const messageProcess = async (job: Job, done: DoneCallback) => {

  try {
    const { fcmtoken, content } = job.data;

    const message = { 
      notification: { 
        title: '🐶오늘의 왈소리 도착~!🐶', 
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
          message: `📣 Successfully sent message: : ${response} ${content}`
        });
        await Reservation.update({
          completed: true
        }, {
          where: { content }
        });
      })
      .catch(error => { 
          logger.appLogger.log({
            level: 'error',
            message: error.message
          }) ;
      });
      done();

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
  }

}
