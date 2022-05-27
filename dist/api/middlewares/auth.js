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
const models_1 = require("../../models");
const apiResponse_1 = require("../../common/apiResponse");
const tokenHandler_1 = require("../../common/tokenHandler");
const resultCode_1 = __importDefault(require("../../constant/resultCode"));
const resultMessage_1 = __importDefault(require("../../constant/resultMessage"));
const logger_1 = __importDefault(require("../../loaders/logger"));
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accesstoken } = req.headers;
    if (!accesstoken) {
        return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.TOKEN_EMPTY);
    }
    try {
        const accessTokenDecoded = yield (0, tokenHandler_1.verifyToken)(accesstoken);
        if (accessTokenDecoded === TOKEN_EXPIRED) {
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.UNAUTHORIZED, resultMessage_1.default.TOKEN_EXPIRED);
        }
        if (accessTokenDecoded === TOKEN_INVALID) {
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.UNAUTHORIZED, resultMessage_1.default.TOKEN_INVALID);
        }
        if (accessTokenDecoded.id === undefined) {
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.UNAUTHORIZED, resultMessage_1.default.TOKEN_INVALID);
        }
        const userId = accessTokenDecoded.id;
        const user = yield models_1.User.findOne({ where: { id: userId } });
        if (!user)
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.NO_USER);
        req.user = user;
        next();
    }
    catch (error) {
        console.error(`[AUTH ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, accesstoken);
        logger_1.default.appLogger.log({ level: "error", message: error.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
    }
});
const authUtil = {
    isAuth,
};
exports.default = authUtil;
//# sourceMappingURL=auth.js.map