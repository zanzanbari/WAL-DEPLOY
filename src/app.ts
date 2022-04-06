import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import apiRouter from './api/routes';
import { connectDB } from './loaders/db';

function startServer() {
    const app = express();
    const logger = morgan('dev');

    // db 연결
    // connectDB();
    
    app.use(cors());
    app.use(logger);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    // 라우팅
    app.use("/api", apiRouter);

    app.use("*", (req, res) => {
        res.status(404).json({
            status: 404,
            success: false,
            message: "잘못된 경로입니다."
        });
    });

    app.listen(5050, () => {
        console.log(`
        ################################################
        🛡️  Server listening on port 🛡️
        ################################################
      `);
    })
    .on("error", err => {
        console.error(err);
        process.exit(1);
    });
}

startServer();