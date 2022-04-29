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
const apiResponse_1 = require("../../modules/apiResponse");
const resultCode_1 = __importDefault(require("../../constant/resultCode"));
const resultMessage_1 = __importDefault(require("../../constant/resultMessage"));
// import AppleAuthService from "@/services/auth/appleAuthService";
const kakaoAuthService_1 = __importDefault(require("../../services/auth/kakaoAuthService"));
const reissueTokenService_1 = __importDefault(require("../../services/auth/reissueTokenService"));
const logger = require("../middlewares/logger");
// TODO controller class 만들어서 해도 될듯? 
const socialLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { social } = req.params;
    try {
        let data;
        switch (social) {
            case "kakao":
                // TODO: typedi container 써서 logger, repository 주입 - 나중에
                const kakaoAuthServiceInstance = new kakaoAuthService_1.default(models_1.User, logger);
                data = yield kakaoAuthServiceInstance.login(req.query);
                break;
            // case "apple":
            //     const appleAuthServiceInstance = new AppleAuthService(User);
            //     data = await appleAuthServiceInstance.login(req.query as TokenDto);
            //     break;
        }
        return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.LOGIN_SUCCESS, data);
    }
    catch (error) {
        logger.appLogger.log({
            level: "error",
            message: error.message
        });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
const socialResign = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { social } = req.params;
    try {
        let data;
        switch (social) {
            case "kakao":
                const kakaoAuthServiceInstance = new kakaoAuthService_1.default(models_1.User, logger);
                data = yield kakaoAuthServiceInstance
                    .resign((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.query);
                break;
            // case "apple":
        }
        return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.DELETE_USER, data);
    }
    catch (error) {
        logger.appLogger.log({
            level: "error",
            message: error.message
        });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    try {
        yield models_1.User.update({
            refreshtoken: null,
        }, {
            where: { userId }
        });
        return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.LOGOUT_SUCCESS, userId);
    }
    catch (error) {
        logger.appLogger.log({
            level: "error",
            message: error.message
        });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
const reissueToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reissueTokenServiceInstance = new reissueTokenService_1.default(models_1.User, logger);
        const data = yield reissueTokenServiceInstance.reissueToken(req.headers);
        if (data === 17 /* TOKEN_EXPIRES */) {
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.UNAUTHORIZED, resultMessage_1.default.PLEASE_LOGIN_AGAIN);
        }
        return (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.REISSUE_TOKEN, data);
    }
    catch (error) {
        logger.appLogger.log({
            level: "error",
            message: error.message
        });
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