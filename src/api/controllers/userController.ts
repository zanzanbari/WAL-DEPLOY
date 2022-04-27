import { NextFunction, Request, Response } from "express";
import { Item, Time, User, UserCategory } from "@/models";
import { ErrorResponse, SuccessResponse } from "@/modules/apiResponse";
import sc from "@/constant/resultCode";
import rm from "@/constant/resultMessage";
import Error from "@/constant/responseError";
import { UserSettingDto } from "@/interface/dto/request/userRequest";
import UserService from "@/services/user/userService";
const logger = require("../middlewares/logger");

const setInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const userId = req.user?.id;

    try {
        
        const userServiceInstance = new UserService(User, Time, Item, UserCategory, logger);
        const data = await userServiceInstance.initSetInfo(userId, req.body as UserSettingDto);

        SuccessResponse(res, sc.CREATED, rm.SET_USER_INFO_SUCCESS,data);
    } catch (error) {
        console.error(error);
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(error);
    }
}


const getInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const userId = req.user?.id;

    try {
        
        const userServiceInstance = new UserService(User, Time, Item, UserCategory, logger);
        const data = await userServiceInstance.getInfo(userId);

        SuccessResponse(res, sc.OK, rm.READ_USER_INFO_SUCCESS, data);

    } catch (error) {
        console.error(error);
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(error);
    }

}


export const userController = {
    setInfo,
    getInfo
}