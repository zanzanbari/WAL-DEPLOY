import { NextFunction, Request, Response } from "express";
import logger from "../../loaders/logger";
import InitService from "../../services/user/initService";
import TimeService from "../../services/user/timeService";
import CategoryService from "../../services/user/categoryService";
import { Item, Time, TodayWal, User, UserCategory } from "../../models";
import { ErrorResponse, SuccessResponse } from "../../modules/apiResponse";
import sc from "../../constant/resultCode";
import rm from "../../constant/resultMessage";
import { UserInfoResponse } from "../../interface/dto/response/userResponse";
import { ResetCategoryDto, ISetTime, UserSettingDto, ResetTimeDto } from "../../interface/dto/request/userRequest";

const setInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
        
    const initServiceInstance = new InitService(User, Time, Item, UserCategory, TodayWal, logger);
    const data = await initServiceInstance.initSetInfo(req.user?.id as number, req.body as UserSettingDto);

    SuccessResponse(res, sc.CREATED, rm.SET_USER_INFO_SUCCESS,data);

  } catch (error) {
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}


const getNicknameInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    
  if (!req.body.nickname) return ErrorResponse(res, sc.BAD_REQUEST, rm.WRONG_BODY_OR_NULL);

  try {

    const user = await User.findById(req.user?.id as number);
    if (!user) return ErrorResponse(res, sc.DB_ERROR, rm.NO_USER);

    const data: UserInfoResponse = {
      nickname: user.getDataValue("nickname"),
      email: user.getDataValue("email")
    };

    SuccessResponse(res, sc.OK, rm.READ_USER_INFO_SUCCESS, data);

  } catch (error) {
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}

const getTimeInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const data = await Time.findById(req.user?.id as number) as ISetTime;
    if (!data) return ErrorResponse(res, sc.DB_ERROR, rm.DB_ERROR);

    SuccessResponse(res, sc.OK, rm.READ_USER_INFO_SUCCESS, data);

  } catch (error) {
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}

const getCategoryInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const categoryServiceInstance = new CategoryService(User, Item, logger);
    const data = categoryServiceInstance.getCategoryInfo(req.user?.id as number);

    SuccessResponse(res, sc.OK, rm.READ_USER_INFO_SUCCESS, await data);

  } catch (error) {
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}


const resetNicknameInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

  if (!req.body.nickname) return ErrorResponse(res, sc.BAD_REQUEST, rm.NULL_VALUE);

  try {

    const user = await User.findByIdAndResetNickname(req.user?.id as number, req.body.nickname as string);
    if (!user) return ErrorResponse(res, sc.BAD_REQUEST, rm.NO_USER);

    const data = { nickname: user.getDataValue("nickname") } as UserInfoResponse;

    SuccessResponse(res, sc.OK, rm.UPDATE_USER_INFO_SUCCESS, data);

  } catch (error) {
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}


const resetTimeInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const timeServiceInstance = new TimeService(Time, TodayWal, logger);
    const data = timeServiceInstance.resetTimeInfo(req.user?.id as number, req.body.data as ResetTimeDto)
        
    SuccessResponse(res, sc.OK, rm.UPDATE_USER_INFO_SUCCESS, await data);

  } catch (error) {
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}


const resetUserCategoryInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    
    const categoryServiceInstance = new CategoryService(User, Item, logger);
    const data = await categoryServiceInstance.resetUserCategoryInfo(req.user?.id as number, req.body.data as ResetCategoryDto);

    SuccessResponse(res, sc.OK, rm.UPDATE_USER_INFO_SUCCESS, data);

  } catch (error) {
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}


export const userController = {
  setInfo,
  getNicknameInfo,
  getTimeInfo,
  getCategoryInfo,
  resetNicknameInfo,
  resetTimeInfo,
  resetUserCategoryInfo
};