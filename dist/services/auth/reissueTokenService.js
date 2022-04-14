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
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("@/modules/validator");
const tokenHandller_1 = require("@/modules/tokenHandller");
class ReissueTokenService {
    constructor(userRepository, logger) {
        this.userRepository = userRepository;
        this.logger = logger;
    }
    reissueToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshTokenDecoded = yield (0, tokenHandller_1.verifyToken)(request.refreshtoken);
                if ((0, validator_1.isTokenExpired)(refreshTokenDecoded))
                    return 17 /* TOKEN_EXPIRES */; // 여기서 그냥 로그아웃을 시켜야 하나?
                const isUser = this.userRepository.findOneByRefreshToken(request.refreshtoken);
                const newAccessToken = yield (0, tokenHandller_1.issueAccessToken)(isUser);
                const user = {
                    id: isUser.id,
                    accesstoken: newAccessToken,
                    // exp: ???
                };
                return user;
            }
            catch (error) {
                this.logger.appLogger.log({
                    level: "error",
                    message: error.message
                });
                // throw new Error(error);
            }
        });
    }
}
;
exports.default = ReissueTokenService;
//# sourceMappingURL=reissueTokenService.js.map