import { NextFunction, Request, Response } from "express";
import { Item, Time, User, UserCategory } from "@/models";
import { ErrorResponse, SuccessResponse } from "@/modules/apiResponse";
import sc from "@/constant/resultCode";
import rm from "@/constant/resultMessage";
import Error from "@/constant/responseError";
import { ResetCategoryDto, UserSetTime, UserSettingDto } from "@/interface/dto/request/userRequest";
import { UserInfoResponse } from "@/interface/dto/response/userResponse";
import UserService from "@/services/user/userService";
const logger = require("../middlewares/logger");

const setInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        
        const userServiceInstance = new UserService(User, Time, Item, UserCategory, logger);
        const data = await userServiceInstance.initSetInfo(req.user?.id as number, req.body as UserSettingDto);

        SuccessResponse(res, sc.CREATED, rm.SET_USER_INFO_SUCCESS,data);
    } catch (error) {
        console.error(error);
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(error);
    }
}


const getNicknameInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const user = await User.findById(req.user?.id as number);
        if (!user) return ErrorResponse(res, sc.DB_ERROR, rm.NO_USER);

        const data = {
            nickname: user.getDataValue("nickname"),
            email: user.getDataValue("email")
        } as UserInfoResponse;

        SuccessResponse(res, sc.OK, rm.READ_USER_INFO_SUCCESS, data);

    } catch (error) {
        logger.appLogger.log({ level: "error", message: error.message });
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

        const times = await Time.findById(req.user?.id as number) as UserSetTime;
        if (!times) return ErrorResponse(res, sc.DB_ERROR, rm.DB_ERROR);

        const data = { times } as UserInfoResponse;

        SuccessResponse(res, sc.OK, rm.READ_USER_INFO_SUCCESS, data);

    } catch (error) {
        logger.appLogger.log({ level: "error", message: error.message });
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

        const categories = await UserCategory.findCategoryByUserId(req.user?.id as number) as number[];
        if (!categories) return ErrorResponse(res, sc.DB_ERROR, rm.DB_ERROR);

        const data = { categories } as UserInfoResponse;

        SuccessResponse(res, sc.OK, rm.READ_USER_INFO_SUCCESS, data);

    } catch (error) {
        logger.appLogger.log({ level: "error", message: error.message });
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(error);
    }

}


const resetNicknameInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        if (!req.body.nickname) return ErrorResponse(res, sc.BAD_REQUEST, rm.NULL_VALUE);

        const user = await User.findByIdAndResetNickname(req.user?.id as number, req.body.nickname as string);
        if (!user) return ErrorResponse(res, sc.BAD_REQUEST, rm.NO_USER);

        const data = { nickname: user.getDataValue("nickname") } as UserInfoResponse;

        SuccessResponse(res, sc.OK, rm.READ_USER_INFO_SUCCESS, data);

    } catch (error) {
        logger.appLogger.log({ level: "error", message: error.message });
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(error);
    }

}


const resetTimeInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const userId = req.user?.id as number;

    try {

        await Time.updateTime(userId, req.body as UserSetTime);
        SuccessResponse(res, sc.OK, rm.UPDATE_USER_INFO_SUCCESS, userId);

    } catch (error) {
        logger.appLogger.log({ level: "error", message: error.message });
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

        const userServiceInstance = new UserService(User, Time, Item, UserCategory, logger);
        const data = await userServiceInstance.resetUserCategoryInfo(req.user?.id as number, req.body as ResetCategoryDto);

        SuccessResponse(res, sc.OK, rm.UPDATE_USER_INFO_SUCCESS, data);

    } catch (error) {
        logger.appLogger.log({ level: "error", message: error.message });
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
}