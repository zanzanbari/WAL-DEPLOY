import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import apiRouter from '../api/routes';
import logger from "./logger";

export default async ({ app }: { app: express.Application }) => {

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
  
}