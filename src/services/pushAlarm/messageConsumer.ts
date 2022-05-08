import { Job, DoneCallback } from "bull";
import admin from "firebase-admin";

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
    
        admin 
          .messaging() 
          .send(message) 
          .then(function (response) { 
              console.log('Successfully sent message: : ', response)
          }) 
          .catch(function (err) { 
              console.log('Error Sending message!!! : ', err)
          });

        done();

    } catch (err) {
        console.log({ level: "error", message: err.message });
    }

}