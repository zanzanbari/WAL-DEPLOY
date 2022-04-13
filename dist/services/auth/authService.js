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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    login(token) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    ;
    resign() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    ;
    issueAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                id: user === null || user === void 0 ? void 0 : user.id,
                nickname: user === null || user === void 0 ? void 0 : user.nickname,
                email: user === null || user === void 0 ? void 0 : user.email,
                social: user === null || user === void 0 ? void 0 : user.social
            };
            const accesstoken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                issuer: process.env.JWT_ISSUER,
                expiresIn: process.env.JWT_AC_EXPIRES,
            });
            return accesstoken;
        });
    }
    ;
    issueRefreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshtoken = jsonwebtoken_1.default.sign({}, process.env.JWT_SECRET, {
                issuer: process.env.JWT_ISSUER,
                expiresIn: process.env.JWT_RF_EXPIRES,
            });
            return refreshtoken;
        });
    }
    ;
}
;
exports.default = AuthService;
//# sourceMappingURL=authService.js.map