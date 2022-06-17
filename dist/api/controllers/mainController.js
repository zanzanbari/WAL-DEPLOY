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
const logger_1 = __importDefault(require("../../loaders/logger"));
const resultCode_1 = __importDefault(require("../../constant/resultCode"));
const resultMessage_1 = __importDefault(require("../../constant/resultMessage"));
const mainService_1 = __importDefault(require("../../services/main/mainService"));
const models_1 = require("../../models");
const apiResponse_1 = require("../../common/apiResponse");
/**
 *  @메인화면
 *  @route GET /main
 *  @access public
 */
const getTodayWals = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const mainServiceInstance = new mainService_1.default(models_1.TodayWal, models_1.Reservation, models_1.Item, logger_1.default);
        const data = mainServiceInstance.getMain((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        (0, apiResponse_1.SuccessResponse)(res, resultCode_1.default.OK, resultMessage_1.default.READ_TODAY_WAL_SUCCESS, yield data);
    }
    catch (error) {
        (0, apiResponse_1.ErrorResponse)(res, resultCode_1.default.INTERNAL_SERVER_ERROR, resultMessage_1.default.INTERNAL_SERVER_ERROR);
        return next(error);
    }
});
const mainController = {
    getTodayWals
};
exports.default = mainController;
//# sourceMappingURL=mainController.js.map