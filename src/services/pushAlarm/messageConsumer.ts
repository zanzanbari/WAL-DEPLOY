import { Job, DoneCallback } from "bull";
import { firebaseApp } from "../../loaders/firebase";

import logger from "../../api/middlewares/logger";

export const messageFunc = async (job: Job, done: DoneCallback) => {
    try {
        const { fcmtoken, content } = job.data;

        let message = { 
            notification: { 
                title: '왈소리 와써💛', 
                body: content,
            }, 
            token: fcmtoken, 
        }
        

        firebaseApp 
            .messaging()
            .send(message) 
            .then(function (response) {
                logger.appLogger.log({
                level: 'info',
                message: `Successfully sent message: : ${response} ${content}`
            }) 
            }) 
            .catch(function (err) { 
                console.log('Error Sending message!!! : ', err) 
                logger.appLogger.log({
                level: 'error',
                message: err.message
            }) 
        });


        done();

    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
    }

}