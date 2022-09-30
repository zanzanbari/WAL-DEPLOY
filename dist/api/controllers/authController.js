"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const models_1 = require("../../models");
const logger_1 = __importDefault(require("../../loaders/logger"));
const resultCode_1 = __importDefault(require("../../constant/resultCode"));
const resultMessage_1 = __importDefault(require("../../constant/resultMessage"));
const apiResponse_1 = require("../../common/apiResponse");
const appleAuthService_1 = __importDefault(require("../../services/auth/appleAuthService"));
const kakaoAuthService_1 = __importDefault(require("../../services/auth/kakaoAuthService"));
const reissueTokenService_1 = __importDefault(require("../../services/auth/reissueTokenService"));
/**
 *  @소셜_로그인
 *  @route POST /auth/:social/login
 *  @params social: kakao | apple
 *  @access public
 */
const socialLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { social } = req.params;
    try {
        let data;
        switch (social) {
            case "kakao":
                // TODO: typedi container 써서 logger, repository 주입 - 나중에
                const kakaoAuthServiceInstance = new kakaoAuthService_1.default(models_1.User, models_1.ResignUser, logger_1.default);
                data = yield kakaoAuthServiceInstance.login(req.query);
                break;
            case "apple":
                const appleAuthServiceInstance = new appleAuthService_1.default(models_1.User, models_1.ResignUser, logger_1.default);
                data = yield appleAuthServiceInstance.login(req.query);
                break;
        }
        return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.LOGIN_SUCCESS, data);
    }
    catch (error) {
        switch (error.message) {
            case ("AXIOS_ERROR"):
                return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.AXIOS_VALIDATE_ERROR);
            default:
                (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        }
        return next(error);
    }
});
/**
 *  @소셜_로그아웃_탈퇴
 *  @route POST /auth/:social/resign
 *  @params social: kakao | apple
 *  @access public
 */
const socialResign = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { social } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const reasonsForResign = req.body.data;
    try {
        switch (social) {
            case "kakao":
                const kakaoAuthServiceInstance = new kakaoAuthService_1.default(models_1.User, models_1.ResignUser, logger_1.default);
                yield kakaoAuthServiceInstance.resign(userId, reasonsForResign, req.body);
                break;
            case "apple":
                const appleAuthServiceInstance = new appleAuthService_1.default(models_1.User, models_1.ResignUser, logger_1.default);
                yield appleAuthServiceInstance.resign(userId, reasonsForResign);
                break;
        }
        return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.DELETE_USER, null);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @로그아웃
 *  @route GET /auth/logout
 *  @access public
 */
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    try {
        // FIXME accesstoken 만료시켜야되는거 아님??
        yield models_1.User.update({
            refreshtoken: null,
        }, {
            where: { id: userId }
        });
        return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.LOGOUT_SUCCESS, userId);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @로그아웃
 *  @route GET /auth/reissue/token
 *  @access public
 */
const reissueToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reissueTokenServiceInstance = new reissueTokenService_1.default(models_1.User, logger_1.default);
        const data = yield reissueTokenServiceInstance.reissueToken(req.headers);
        if (data === 17 /* TOKEN_EXPIRES */) {
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.UNAUTHORIZED, resultMessage_1.default.PLEASE_LOGIN_AGAIN);
        }
        return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.REISSUE_TOKEN, data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
exports.authController = {
    socialLogin,
    logout,
    reissueToken,
    socialResign
};
//# sourceMappingURL=authController.js.map