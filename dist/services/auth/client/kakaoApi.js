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
exports.KakaoUnlinkApi = exports.KakaoAuthApi = void 0;
const axios_1 = __importDefault(require("axios"));
const logger = require("../../../api/middlewares/logger");
function KakaoAuthApi(kakoAccessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiUrl = "https://kapi.kakao.com/v2/user/me";
            const reqConfig = {
                headers: {
                    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                    "Authorization": `Bearer ${kakoAccessToken}`
                }
            };
            const userData = yield axios_1.default.post(apiUrl, {}, reqConfig)
                .then((resolve) => {
                const nickname = resolve.data.properties["nickname"];
                const email = resolve.data.kakao_account["email"];
                return { nickname, email };
            });
            return userData;
        }
        catch (error) {
            logger.appLogger.log({
                level: 'error',
                message: error.message
            });
            throw new Error("❌ AXIOS_ERROR ❌");
        }
    });
}
exports.KakaoAuthApi = KakaoAuthApi;
;
function KakaoUnlinkApi(kakoAccessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiUrl = "https://kapi.kakao.com/v1/user/unlink";
            const reqConfig = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${kakoAccessToken}`
                }
            };
            const userData = axios_1.default.post(apiUrl, {}, reqConfig);
            logger.httpLogStream.write({
                level: "info",
                message: yield userData
            });
        }
        catch (error) {
            logger.appLogger.log({
                level: 'error',
                message: error.message
            });
            throw new Error("❌ AXIOS_ERROR ❌");
        }
    });
}
exports.KakaoUnlinkApi = KakaoUnlinkApi;
//# sourceMappingURL=kakaoApi.js.map