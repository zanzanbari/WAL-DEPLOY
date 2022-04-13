import { NextFunction, Request, Response } from "express";
import { User } from "@/models";
import { ErrorResponse, SuccessResponse } from "@/modules/apiResponse";
import sc from "@/constant/resultCode";
import rm from "@/constant/resultMessage";
// import AppleAuthService from "@/services/auth/appleAuthService";
import KakaoAuthService from "@/services/auth/kakaoAuthService";
import { TokenDto } from "@/interface/dto/request/authRequest";
import { AuthResponse } from "@/interface/dto/response/authResponse";
const logger = require("../middlewares/logger");

// TODO controller class 만들어서 해도 될듯? 

const socialLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { social } = req.params;

    try {
        let data: AuthResponse | undefined;
        switch(social) {
            case "kakao":
                // TODO: typedi container 써서 logger, repository 주입 - 나중에
                const kakaoAuthServiceInstance = new KakaoAuthService(User, logger);
                data = await kakaoAuthServiceInstance.login(req.query as TokenDto);
                break;
            // case "apple":
            //     const appleAuthServiceInstance = new AppleAuthService(User);
            //     data = await appleAuthServiceInstance.login(req.query as TokenDto);
            //     break;
        }

        return SuccessResponse(res, sc.OK, rm.LOGIN_SUCCESS, data);
    } catch (error) {
        logger.appLogger.log({
            level: "error",
            message: error.message
        });
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(error);
    }
};



const logout = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    try {

        await User.update({
            refreshtoken: null,
        }, {
            where: { userId }
        });
        
        return SuccessResponse(res, sc.OK, rm.LOGOUT_SUCCESS, userId);

    } catch (error) {
        logger.appLogger.log({
            level: "error",
            message: error.message
        });
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(error);
    }
}




export const authController = {
    socialLogin,
    logout
}
