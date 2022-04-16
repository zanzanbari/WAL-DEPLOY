import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import sc from "@/constant/resultCode";
import rm from "@/constant/resultMessage";
import { ErrorResponse } from "@/modules/apiResponse";
import { SocialType, TokenDto } from "@/interface/dto/request/authRequest";
const logger = require("../../api/middlewares/logger");

// fcmtoken optional 로 한거 개맘에 안드는데,,, isLogin 따로 빼면 코드 중복 개쩔거같고,,, 고민
const loginCheck = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  
  const loginParamSchema = Joi.object().keys({
    social: Joi.string().required().valid("apple", "kakao"),
  });
  const loginQuerySchema = Joi.object().keys({
    socialtoken: Joi.string().token().required(),
    fcmtoken: Joi.string().token().optional()
  });
  
  try {
    // validate 쓰면 error 속성 존재, validateAsync 쓰면 없고 catch error 해줘야함 
    // -> 비동기 최대로 활용 못하는거 같아서 좀 아쉬움
    const paramsError = await loginParamSchema
      .validateAsync(req.params as SocialType)
      .catch(error => {
        return error;
      });

    const queryError = await loginQuerySchema
      .validateAsync(req.query as TokenDto)
      .catch(error => {
        return error;
      });
      
    if ( paramsError.details || queryError.details) { // ( error 에만 존재하는 detail )
      return ErrorResponse(res, sc.BAD_REQUEST, rm.WRONG_PARAMS_OR_NULL);
    }

    next();
        
  } catch (error) {
    console.error(`[VALIDATE ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`);
    logger.appLogger.log({ level: "error", message: error.message}); 
    ErrorResponse(res, sc.BAD_REQUEST, rm.WRONG_PARAMS_OR_NULL);  
  }
};



const validateUtil = {
  loginCheck,
}

export default validateUtil;