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
const tokenHandler_1 = require("../../common/tokenHandler");
class AppleAuthService {
    constructor(userRepository, resignUserRepository, logger) {
        this.userRepository = userRepository;
        this.resignUserRepository = resignUserRepository;
        this.logger = logger;
    }
    /**
     *  @desc 애플_로그인
     *  @route POST /auth/apple/login
     *  @access public
     */
    login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // FIXME apple server 공개 키로 jwt 해독
                const payload = jwt.decode(request.socialtoken);
                const userData = { email: payload.sub, nickname: null };
                const isResignedUser = yield this.resignUserRepository.existsInaDayByEmail(payload.sub); //24시간 내 탈퇴한 유저
                if (isResignedUser)
                    throw new Error("Forbidden");
                const refreshtoken = yield (0, tokenHandler_1.issueRefreshToken)();
                const socialUser = yield this.userRepository.findByEmailOrCreateSocialUser("apple", userData, request, refreshtoken);
                const accesstoken = yield (0, tokenHandler_1.issueAccessToken)(socialUser);
                const user = {
                    nickname: socialUser.nickname,
                    accesstoken,
                    refreshtoken
                };
                return user;
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
    /**
     *  @desc 애플_로그아웃_탈퇴
     *  @route POST /auth/apple/resign
     *  @access public
     */
    resign(userId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resignedUser = yield this.userRepository.findAndDelete(userId);
                yield this.resignUserRepository.save(userId, reason, resignedUser.email);
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
}
exports.default = AppleAuthService;
//# sourceMappingURL=appleAuthService.js.map