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
        title: 'πΆμ€λμ μμλ¦¬ λμ°©~!πΆ', 
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
          message: `π£ Successfully sent message: : ${response} ${content} ${job.id}`
        });
        if (isReserved) {
          await Reservation.update({
            completed: true
          }, {
            where: { content }
          });
          logger.appLogger.log({ level: "info", message: "μμ½ μμλ¦¬ μ μ‘μλ£"});
        }
        
      })
      .catch(error => { 

        logger.appLogger.log({
          level: 'error',
          message: `β SENDING MESSAGE ERROR :: ${error.message}`
        });
      });

    done();

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
  }

}
