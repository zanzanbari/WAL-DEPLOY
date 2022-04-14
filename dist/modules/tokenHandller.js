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
exports.verifyToken = exports.issueRefreshToken = exports.issueAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
const issueAccessToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.issueAccessToken = issueAccessToken;
const issueRefreshToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const refreshtoken = jsonwebtoken_1.default.sign({}, process.env.JWT_SECRET, {
        issuer: process.env.JWT_ISSUER,
        expiresIn: process.env.JWT_RF_EXPIRES,
    });
    return refreshtoken;
});
exports.issueRefreshToken = issueRefreshToken;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        if (error.message === "jwt expired") {
            console.log("토큰이 만료되었습니다");
            return TOKEN_EXPIRED;
        }
        else if (error.message === "jwt invalid") {
            console.log("토큰이 유효하지 않습니다");
            return TOKEN_INVALID;
        }
        else {
            console.log("토큰 검증 오류");
            return TOKEN_INVALID;
        }
    }
    return decoded;
});
exports.verifyToken = verifyToken;
//# sourceMappingURL=tokenHandller.js.map