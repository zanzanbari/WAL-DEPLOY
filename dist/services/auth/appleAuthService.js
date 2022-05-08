"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const tokenHandller_1 = require("../../modules/tokenHandller");
class AppleAuthService {
    constructor(userRepository, logger) {
        this.userRepository = userRepository;
        this.logger = logger;
    }
    login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 결국 해야되는건 -> id_token 받아서 
                // apple server 공개 키로 jwt 해독 (해야하는데 실패) -> 나중에 다시 시도
                const payload = jwt.decode(request.socialtoken);
                const userData = { email: payload.sub, nickname: null };
                const refreshtoken = yield (0, tokenHandller_1.issueRefreshToken)();
                const socialUser = yield this.userRepository.findByEmailOrCreateSocialUser("kakao", userData, request, refreshtoken);
                const accesstoken = yield (0, tokenHandller_1.issueAccessToken)(socialUser);
                const user = {
                    nickname: socialUser.nickname,
                    accesstoken,
                    refreshtoken
                };
                return user;
            }
            catch (error) {
                console.error(error);
                this.logger.appLogger.log({
                    level: "error",
                    message: error.message
                });
                throw new Error(error);
            }
        });
    }
    resign(userId, token) {
        throw new Error("Method not implemented.");
    }
}
exports.default = AppleAuthService;
//# sourceMappingURL=appleAuthService.js.map