import { NextFunction, Request, Response } from "express";
import { User, ResignUser } from "../../models";
import logger from "../../loaders/logger";
import sc from "../../constant/resultCode";
import rm from "../../constant/resultMessage";
import Error from "../../constant/responseError";
import { ErrorResponse, SuccessResponse } from "../../common/apiResponse";
import AppleAuthService from "../../services/auth/appleAuthService";
import KakaoAuthService from "../../services/auth/kakaoAuthService";
import { ReissueToken, TokenDto } from "../../dto/request/authRequest";
import { AuthResponse } from "../../dto/response/authResponse";
import ReissueTokenService from "../../services/auth/reissueTokenService";

/**
 *  @소셜_로그인
 *  @route POST /auth/:social/login
 *  @params social: kakao | apple
 *  @access public
 */

const socialLogin = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const { social } = req.params;

  try {

    let data: AuthResponse | undefined;
    switch(social) {
      case "kakao":
        // TODO: typedi container 써서 logger, repository 주입 - 나중에
        const kakaoAuthServiceInstance = new KakaoAuthService(User, ResignUser, logger);
        data = await kakaoAuthServiceInstance.login(req.query as TokenDto);
        break;
      case "apple":
        const appleAuthServiceInstance = new AppleAuthService(User, ResignUser, logger);
        data = await appleAuthServiceInstance.login(req.query as TokenDto);
        break;
    }

    return SuccessResponse(res, sc.OK, rm.LOGIN_SUCCESS, data);

  } catch (error) {
    switch(error.message) {
      case("AXIOS_ERROR"): 
        return ErrorResponse(res, sc.BAD_REQUEST, rm.AXIOS_VALIDATE_ERROR);
      case("Forbidden"):
        return ErrorResponse(res, sc.FORBIDDEN, rm.FORBIDDEN_LOGIN_IF_RESIGNED);
      default:
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    }
    return next(error);
  }

};

/**
 *  @소셜_로그아웃_탈퇴
 *  @route POST /auth/:social/resign
 *  @params social: kakao | apple
 *  @access public
 */

const socialResign = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { social } = req.params;
  const userId = req.user?.id as number
  const reasonsForResign = req.body.data;

  try {

    switch(social) {
      case "kakao":
        const kakaoAuthServiceInstance = new KakaoAuthService(User, ResignUser, logger);
        await kakaoAuthServiceInstance.resign(userId, reasonsForResign, req.body as TokenDto);
        break;
      case "apple":
        const appleAuthServiceInstance = new AppleAuthService(User, ResignUser,logger);
        await appleAuthServiceInstance.resign(userId, reasonsForResign);
        break;
    }

    return SuccessResponse(res, sc.OK, rm.DELETE_USER, null)

  } catch (error) {
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}

/**
 *  @로그아웃
 *  @route GET /auth/reissue/token
 *  @access public
 */

const reissueToken = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {

  try {

    const reissueTokenServiceInstance = new ReissueTokenService(User, logger);
    const data = await reissueTokenServiceInstance.reissueToken(req.headers as unknown as ReissueToken);

    if (data === Error.TOKEN_EXPIRES) {
      return ErrorResponse(res, sc.UNAUTHORIZED, rm.PLEASE_LOGIN_AGAIN);
    }

    return SuccessResponse(res, sc.OK, rm.REISSUE_TOKEN, data);

  } catch (error) {
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }
  
}


export const authController = {
  socialLogin,
  reissueToken,
  socialResign
}
