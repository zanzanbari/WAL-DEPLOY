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
const joi_1 = __importDefault(require("joi"));
const resultCode_1 = __importDefault(require("../../constant/resultCode"));
const resultMessage_1 = __importDefault(require("../../constant/resultMessage"));
const apiResponse_1 = require("../../modules/apiResponse");
const logger = require("../../api/middlewares/logger");
// fcmtoken optional 로 한거 개맘에 안드는데,,, isLogin 따로 빼면 코드 중복 개쩔거같고,,, 고민
const loginRequestCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginParamSchema = joi_1.default.object().keys({
        social: joi_1.default.string().required().valid("apple", "kakao"),
    });
    const loginQuerySchema = joi_1.default.object().keys({
        socialtoken: joi_1.default.string().token().required(),
        fcmtoken: joi_1.default.string().token().optional()
    });
    try {
        // validate 쓰면 error 속성 존재, validateAsync 쓰면 없고 catch error 해줘야함 
        // -> 비동기 최대로 활용 못하는거 같아서 좀 아쉬움
        const paramsError = yield loginParamSchema
            .validateAsync(req.params)
            .catch(err => { return err; });
        const queryError = yield loginQuerySchema
            .validateAsync(req.query)
            .catch(err => { return err; });
        if (paramsError.details || queryError.details) { // ( error 에만 존재하는 detail )
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.WRONG_PARAMS_OR_NULL);
        }
        next();
    }
    catch (error) {
        console.error(`[VALIDATE ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`);
        logger.appLogger.log({ level: "error", message: error.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
    }
});
const initRequestCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const setInfoSchema = joi_1.default.object().keys({
        nickname: joi_1.default.string().required().max(10),
        dtype: joi_1.default.array().items(joi_1.default.string()).required(),
        time: joi_1.default.array().items(joi_1.default.string()).required()
    });
    try {
        const bodyError = yield setInfoSchema
            .validateAsync(req.body)
            .catch(err => { return err; });
        if (bodyError.details) {
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.WRONG_PARAMS_OR_NULL);
        }
        next();
    }
    catch (error) {
        console.error(`[VALIDATE ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`);
        logger.appLogger.log({ level: "error", message: error.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
    }
});
const timeRequestCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const timeSchema = joi_1.default.object().keys({
        morning: joi_1.default.boolean().required(),
        afternoon: joi_1.default.boolean().required(),
        night: joi_1.default.boolean().required(),
    });
    try {
        const bodyError = yield timeSchema
            .validateAsync(req.body)
            .catch(err => { return err; });
        if (bodyError.details) {
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.WRONG_PARAMS_OR_NULL);
        }
        next();
    }
    catch (error) {
        console.error(`[VALIDATE ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`);
        logger.appLogger.log({ level: "error", message: error.message });
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
    }
});
const validateUtil = {
    loginRequestCheck,
    initRequestCheck,
    timeRequestCheck
};
exports.default = validateUtil;
//# sourceMappingURL=requestValidator.js.map