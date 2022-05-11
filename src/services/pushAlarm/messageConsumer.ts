import { Job, DoneCallback } from "bull";
import admin from "firebase-admin";
const serviceAccount = require("../../../firebase-admin.json");

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
        let firebase: admin.app.App;
        if (admin.apps.length === 0) {
        admin
          .initializeApp({
            credential: admin.credential.cert(serviceAccount),
          })
          .messaging() 
          .send(message) 
          .then(function (response) { 
              console.log('Successfully sent message: : ', response)
          }) 
          .catch(function (err) { 
              console.log('Error Sending message!!! : ', err)
          });
        }
        done();

    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
    }

}