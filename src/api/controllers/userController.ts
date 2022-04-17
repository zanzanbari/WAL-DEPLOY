import { NextFunction, Request, Response } from "express";
import { User, UserCategory } from "@/models";
import { ErrorResponse, SuccessResponse } from "@/modules/apiResponse";
import sc from "@/constant/resultCode";
import rm from "@/constant/resultMessage";
import Error from "@/constant/responseError";
import { UserSettingDto } from "@/interface/dto/request/userRequest";
const logger = require("../middlewares/logger");
import setInfoService from "@/services/user/setInfoService";

const setInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { 
        nickname, 
        dtype, 
        time
    } = req.body;

    const { id: userId } = req.user;
    //const userId = 5;
    try {
        const userServiceInstance = await setInfoService(userId, req.body);

        SuccessResponse(res, sc.CREATED, rm.ADD_ONE_POST_SUCCESS, {});
    } catch (error) {
        console.log(error);
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    }
}


export const userController = {
    setInfo
}