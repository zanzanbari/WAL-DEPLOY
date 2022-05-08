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
const models_1 = require("../../models");
const apiResponse_1 = require("../../modules/apiResponse");
const resultCode_1 = __importDefault(require("../../constant/resultCode"));
const resultMessage_1 = __importDefault(require("../../constant/resultMessage"));
const userService_1 = __importDefault(require("../../services/user/userService"));
const logger_1 = __importDefault(require("../middlewares/logger"));
const setInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userServiceInstance = new userService_1.default(models_1.User, models_1.Time, models_1.Item, models_1.UserCategory, models_1.TodayWal, logger_1.default);
        const data = yield userServiceInstance.initSetInfo((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.body);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.CREATED, resultMessage_1.default.SET_USER_INFO_SUCCESS, data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
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
const getTimeInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const data = yield models_1.Time.findById((_c = req.user) === null || _c === void 0 ? void 0 : _c.id);
        if (!data)
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.DB_ERROR, resultMessage_1.default.DB_ERROR);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.READ_USER_INFO_SUCCESS, data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
const getCategoryInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const userServiceInstance = new userService_1.default(models_1.User, models_1.Time, models_1.Item, models_1.UserCategory, models_1.TodayWal, logger_1.default);
        const data = yield userServiceInstance.getCategoryInfo((_d = req.user) === null || _d === void 0 ? void 0 : _d.id);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.READ_USER_INFO_SUCCESS, data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
const resetNicknameInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        if (!req.body.nickname)
            return (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.BAD_REQUEST, resultMessage_1.default.NULL_VALUE);
        const user = yield models_1.User.findByIdAndResetNickname((_e = req.user) === null || _e === void 0 ? void 0 : _e.id, req.body.nickname);
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
const resetTimeInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id;
    try {
        yield models_1.Time.updateTime(userId, req.body);
        const data = models_1.Time.findById(userId);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.UPDATE_USER_INFO_SUCCESS, yield data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
const resetUserCategoryInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const userServiceInstance = new userService_1.default(models_1.User, models_1.Time, models_1.Item, models_1.UserCategory, models_1.TodayWal, logger_1.default);
        const data = yield userServiceInstance.resetUserCategoryInfo((_g = req.user) === null || _g === void 0 ? void 0 : _g.id, req.body.data);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.UPDATE_USER_INFO_SUCCESS, data);
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