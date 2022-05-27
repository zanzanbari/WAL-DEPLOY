import { NextFunction, Request, Response } from "express";
import { User } from "../../models";
import { ErrorResponse } from "../../common/apiResponse";
import { verifyToken } from "../../common/tokenHandler";
import sc from "../../constant/resultCode";
import rm from "../../constant/resultMessage";
import { TokenDto } from "../../interface/dto/request/authRequest";
import { UserInfo } from "../../interface/dto/response/authResponse";
import logger from "../../loaders/logger";
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const isAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { accesstoken } = req.headers as TokenDto;
    if (!accesstoken) { 
        return ErrorResponse(res, sc.BAD_REQUEST, rm.TOKEN_EMPTY);
    } 

    try {

        const accessTokenDecoded = await verifyToken(accesstoken);

        if (accessTokenDecoded === TOKEN_EXPIRED) {
            return ErrorResponse(res, sc.UNAUTHORIZED, rm.TOKEN_EXPIRED);
        }
        if (accessTokenDecoded === TOKEN_INVALID) {
            return ErrorResponse(res, sc.UNAUTHORIZED, rm.TOKEN_INVALID);
        }
        if (accessTokenDecoded.id === undefined) {
            return ErrorResponse(res, sc.UNAUTHORIZED, rm.TOKEN_INVALID);
        }

        const userId = accessTokenDecoded.id as number;
        const user = await User.findOne({ where: { id: userId } }) as User;
        if (!user) return ErrorResponse(res, sc.BAD_REQUEST, rm.NO_USER);

        req.user = user as UserInfo;
        next();

    } catch (error) {
        console.error(`[AUTH ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, accesstoken);
        logger.appLogger.log({ level: "error", message: error.message}); 
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    }
};

const authUtil = {
    isAuth,
};

export default authUtil;