import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import apiRouter from './api/routes';
import { connectDB } from './loaders/db';
import { updateToday } from './services/pushAlarm';
import logger from './loaders/logger';
import config from './config';

function startServer(): void {
    const app = express();
    logger.appLogger.log({
        level: 'info',
        message: "잘 돌아간다"
    })
    // db 연결
    connectDB();
    updateToday(); //자정마다 todayWal 업데이트
 
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
        });
    });

    app.listen(config.port, () => {
        console.log(`
        ################################################
        🛡️  Server listening on port 🛡️
        ################################################
      `);
    })
    .on("error", (err) => {
        logger.appLogger.log({
            level: 'error',
            message: err.message
        });
        process.exit(1);
    });
}

startServer();