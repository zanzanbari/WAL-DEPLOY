"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenExpired = exports.verifyToken = exports.passwordValidator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
const passwordValidator = (pwd) => {
    const password = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,64}$/;
    if (!password.test(pwd))
        return false;
    else
        return true;
};
exports.passwordValidator = passwordValidator;
const verifyToken = (token) => {
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
};
exports.verifyToken = verifyToken;
function isTokenExpired(decoded) {
    return decoded === TOKEN_EXPIRED || decoded === TOKEN_INVALID;
}
exports.isTokenExpired = isTokenExpired;
// export function isNullValues(obj: object): boolean | undefined {
//     // TODO: [Symbol.iterator], generator 사용하기
//     for (let key in obj) {
//         console.log(obj[key]);
//         if (obj[key] === undefined) return false;
//         else return true;
//     }
// }
//# sourceMappingURL=validator.js.map