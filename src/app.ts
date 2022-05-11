import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import apiRouter from './api/routes';
import { connectDB } from './loaders/db';
import { updateToday,updateTodayWal } from './services/pushAlarm';
import logger from './api/middlewares/logger';
import {addUserTime} from "./services/pushAlarm/producer"
import admin from "firebase-admin";
import { FirebaseApp } from '@firebase/app'

const serviceAccount = require("../firebase-admin.json");

function startServer(): void {
    const app = express();
    const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined";
    let message = { 
        notification: { 
            title: '왈소리 와써💛', 
            body: "그만하자",
        }, 
        token: "fCRwgfoiSUyhtoZ0PrnJze:APA91bHDjRWuGxInIdyxWCIes75vIZjHKp9K8JuGmYmTPNFHQ9i_b_PGnlhZVhCP1VMb0PtiK9xmjA4GqFp8I3qqBN7zd5F8yxUDQzkFpf-R32kdC4r_jUoSIxoSBR1KsOJ4rrjlTSRa", 
    }
   
    admin
      .initializeApp({
        credential: admin.credential?.cert(serviceAccount),
      });
    admin
      .messaging() 
      .send(message) 
      .then(function (response) { 
          console.log('Successfully sent message: : ', response)
      }) 
      .catch(function (err) { 
          console.log('Error Sending message!!! : ', err)
      });
    
    // db 연결
    connectDB();
    updateToday(); //자정마다 todayWal 업데이트
    addUserTime(1)
 
    app.use(cors());
    app.use(morgan('HTTP/:http-version :method :url :status', { 
        stream: logger.httpLogStream 
    })); // NOTE: http request 로그 남기기
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());


    // 라우팅
    app.use("/api/v1", apiRouter);

    app.use("*", (req, res) => {
        res.status(404).json({
            status: 404,
            success: false,
            message: "잘못된 경로입니다."
        });
        //app log 남기기
        const err = new Error(`잘못된 경로입니다.`);
        logger.appLogger.log({
            level: 'error',
            message: err.message
        })
    });

    app.listen(8080, () => {
        console.log(`
        ################################################
        🛡️  Server listening on port 8080🛡️
        ################################################
      `);
    })
    .on("error", (err) => {
        logger.appLogger.log({
            level: 'error',
            message: err.message
        })
        process.exit(1);
    });
}

startServer();