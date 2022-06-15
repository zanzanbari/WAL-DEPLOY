import { NextFunction, Request, Response } from "express";
import logger from "../../loaders/logger";
import sc from "../../constant/resultCode";
import rm from "../../constant/resultMessage";
import InitService from "../../services/user/initService";
import TimeService from "../../services/user/timeService";
import CategoryService from "../../services/user/categoryService";
import { Item, Time, TodayWal, User, UserCategory } from "../../models";
import { ErrorResponse, SuccessResponse } from "../../common/apiResponse";
import { UserInfoResponse } from "../../interface/dto/response/userResponse";
import { ResetCategoryDto, ISetTime, UserSettingDto, ResetTimeDto } from "../../interface/dto/request/userRequest";

  /**
   *  @유저_초기_설정
   *  @route POST /user/set-info
   *  @access public
   */

const setInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
        
    const initServiceInstance = new InitService(User, Time, Item, UserCategory, TodayWal, logger);
    const data = initServiceInstance.initSetInfo(req.user?.id as number, req.body as UserSettingDto);

    SuccessResponse(res, sc.CREATED, rm.SET_USER_INFO_SUCCESS,await data);

  } catch (error) {
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}

  /**
   *  @유저_닉네임_조회
   *  @route GET /user/info/nickname
   *  @access public
   */

const getNicknameInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

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

  /**
   *  @유저_닉네임_수정
   *  @route POST /user/info/nickname
   *  @access public
   */

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

  /**
   *  @유저_알람시간_조회
   *  @route GET /user/info/time
   *  @access public
   */

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

/**
 *  @유저_알람시간_수정
 *  @route POST /user/info/time
 *  @access public
 */

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

  /**
   *  @유저_왈소리유형_정보_조회
   *  @route GET /user/info/category
   *  @access public
   */

const getCategoryInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const categoryServiceInstance = new CategoryService(UserCategory, Item, logger);
    const data = categoryServiceInstance.getCategoryInfo(req.user?.id as number);

    SuccessResponse(res, sc.OK, rm.READ_USER_INFO_SUCCESS, await data);

  } catch (error) {
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}

  /**
   *  @유저_왈소리유형_정보_수정
   *  @route POST /user/info/category
   *  @access public
   */

const resetUserCategoryInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    
    const categoryServiceInstance = new CategoryService(User, Item, logger);
    const data = categoryServiceInstance.resetUserCategoryInfo(req.user?.id as number, req.body.data as ResetCategoryDto);

    SuccessResponse(res, sc.OK, rm.UPDATE_USER_INFO_SUCCESS, await data);

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