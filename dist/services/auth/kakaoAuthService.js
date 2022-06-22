"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const kakaoApi_1 = __importDefault(require("./client/kakaoApi"));
const tokenHandler_1 = require("../../common/tokenHandler");
let KakaoAuthService = class KakaoAuthService {
    // TODO 주입해주고 싶다 
    constructor(userRepository, logger) {
        this.userRepository = userRepository;
        this.logger = logger;
    }
    /**
     *  @desc 카카오_로그인
     *  @route POST /auth/kakao/login
     *  @access public
     */
    login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield kakaoApi_1.default.auth(request.socialtoken);
                const refreshtoken = yield (0, tokenHandler_1.issueRefreshToken)();
                const socialUser = yield this.userRepository.findByEmailOrCreateSocialUser("kakao", userData, request, refreshtoken);
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
     *  @desc 카카오_로그아웃_탈퇴
     *  @route POST /auth/kakao/resign
     *  @access public
     */
    resign(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unlinkedUser = kakaoApi_1.default.unlink(request.socialtoken);
                const resignedUser = this.userRepository.findAndDelete(userId);
                yield unlinkedUser;
                return yield resignedUser;
            }
            catch (error) {
                this.logger.appLogger.log({ level: "error", message: error.message });
                throw error;
            }
        });
    }
};
KakaoAuthService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object, Object])
], KakaoAuthService);
exports.default = KakaoAuthService;
//# sourceMappingURL=kakaoAuthService.js.map