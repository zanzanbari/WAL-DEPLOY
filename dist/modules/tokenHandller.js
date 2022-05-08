"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.verifyToken = exports.issueRefreshToken = exports.issueAccessToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
const jwtSecret = process.env.JWT_SECRET;
const issueAccessToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        id: user === null || user === void 0 ? void 0 : user.id,
        nickname: user === null || user === void 0 ? void 0 : user.nickname,
        email: user === null || user === void 0 ? void 0 : user.email,
        social: user === null || user === void 0 ? void 0 : user.social
    };
    const accesstoken = jwt.sign(payload, jwtSecret, {
        issuer: process.env.JWT_ISSUER,
        expiresIn: process.env.JWT_AC_EXPIRES,
    });
    return accesstoken;
});
exports.issueAccessToken = issueAccessToken;
const issueRefreshToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const refreshtoken = jwt.sign({}, jwtSecret, {
        issuer: process.env.JWT_ISSUER,
        expiresIn: process.env.JWT_RF_EXPIRES,
    });
    return refreshtoken;
});
exports.issueRefreshToken = issueRefreshToken;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    try {
        decoded = jwt.verify(token, jwtSecret);
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
// public key로 검증하는 함수
// 검증 성공하면 안에 정보 뽑아서 반환
// export const verifyAppleIdToken = async (id_token: string) => {
//     try {
//         const keys = await appleApiUtil.getPublicKey();
//         for (const key of keys) {
//         }
//         jwt.verify(id_token, keys,{
//             algorithms: process.env.APPLE_ALGORITHM,
//             issuer: process.env.APPLE_ISSUER,
//             audience: process.env.APPLE_CLIENT_ID
//         })
//     } catch (error) {
//     }
// }
//# sourceMappingURL=tokenHandller.js.map