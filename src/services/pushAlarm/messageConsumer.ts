import { Job, DoneCallback } from "bull";
import { firebaseApp } from "../../loaders/firebase";
import logger from "../../loaders/logger";

export const messageFunc = async (job: Job, done: DoneCallback) => {

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
      .then(response => {
        logger.appLogger.log({
          level: 'info',
          message: `📣 Successfully sent message: : ${response} ${content} ${job.id}`
        });
      })
      .catch(error => {
        logger.appLogger.log({
          level: 'error',
          message: `❌ SENDING MESSAGE ERROR :: ${error.message}`
        });
      });

    done();

  } catch (error) {
    logger.appLogger.log({ level: "erroror", message: error.message });
    throw error;
  }

}
