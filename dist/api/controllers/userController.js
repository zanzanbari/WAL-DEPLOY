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
exports.userController = void 0;
const logger_1 = __importDefault(require("../../loaders/logger"));
const resultCode_1 = __importDefault(require("../../constant/resultCode"));
const resultMessage_1 = __importDefault(require("../../constant/resultMessage"));
const initService_1 = __importDefault(require("../../services/user/initService"));
const timeService_1 = __importDefault(require("../../services/user/timeService"));
const categoryService_1 = __importDefault(require("../../services/user/categoryService"));
const models_1 = require("../../models");
const apiResponse_1 = require("../../common/apiResponse");
/**
 *  @유저_초기_설정
 *  @route POST /user/set-info
 *  @access public
 */
const setInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const initServiceInstance = new initService_1.default(models_1.User, models_1.Time, models_1.Item, models_1.UserCategory, models_1.TodayWal, logger_1.default);
        const data = initServiceInstance.initSetInfo((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.body);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.CREATED, resultMessage_1.default.SET_USER_INFO_SUCCESS, yield data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @유저_닉네임_조회
 *  @route GET /user/info/nickname
 *  @access public
 */
const getNicknameInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!req.body.nickname)
        return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.WRONG_BODY_OR_NULL);
    try {
        const user = yield models_1.User.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!user)
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.DB_ERROR, resultMessage_1.default.NO_USER);
        const data = {
            nickname: user.getDataValue("nickname"),
            email: user.getDataValue("email")
        };
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.READ_USER_INFO_SUCCESS, data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @유저_닉네임_수정
 *  @route POST /user/info/nickname
 *  @access public
 */
const resetNicknameInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    if (!req.body.nickname)
        return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.NULL_VALUE);
    try {
        const user = yield models_1.User.findByIdAndResetNickname((_c = req.user) === null || _c === void 0 ? void 0 : _c.id, req.body.nickname);
        if (!user)
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.NO_USER);
        const data = { nickname: user.getDataValue("nickname") };
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.UPDATE_USER_INFO_SUCCESS, data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @유저_알람시간_조회
 *  @route GET /user/info/time
 *  @access public
 */
const getTimeInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const data = yield models_1.Time.findById((_d = req.user) === null || _d === void 0 ? void 0 : _d.id);
        if (!data)
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.DB_ERROR, resultMessage_1.default.DB_ERROR);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.READ_USER_INFO_SUCCESS, data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @유저_알람시간_수정
 *  @route POST /user/info/time
 *  @access public
 */
const resetTimeInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const timeServiceInstance = new timeService_1.default(models_1.Time, models_1.TodayWal, logger_1.default);
        const data = timeServiceInstance.resetTimeInfo((_e = req.user) === null || _e === void 0 ? void 0 : _e.id, req.body.data);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.UPDATE_USER_INFO_SUCCESS, yield data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @유저_왈소리유형_정보_조회
 *  @route GET /user/info/category
 *  @access public
 */
const getCategoryInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const categoryServiceInstance = new categoryService_1.default(models_1.User, models_1.Item, logger_1.default);
        const data = categoryServiceInstance.getCategoryInfo((_f = req.user) === null || _f === void 0 ? void 0 : _f.id);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.READ_USER_INFO_SUCCESS, yield data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
/**
 *  @유저_왈소리유형_정보_수정
 *  @route POST /user/info/category
 *  @access public
 */
const resetUserCategoryInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const categoryServiceInstance = new categoryService_1.default(models_1.User, models_1.Item, logger_1.default);
        const data = categoryServiceInstance.resetUserCategoryInfo((_g = req.user) === null || _g === void 0 ? void 0 : _g.id, req.body.data);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.UPDATE_USER_INFO_SUCCESS, yield data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
exports.userController = {
    setInfo,
    getNicknameInfo,
    getTimeInfo,
    getCategoryInfo,
    resetNicknameInfo,
    resetTimeInfo,
    resetUserCategoryInfo
};
//# sourceMappingURL=userController.js.map