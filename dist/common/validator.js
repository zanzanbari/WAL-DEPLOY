"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenExpired = exports.isEmail = exports.passwordValidator = void 0;
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
const isEmail = (email) => {
    const validator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!validator.test(email))
        return false;
    else
        return true;
};
exports.isEmail = isEmail;
function isTokenExpired(decoded) {
    return decoded === TOKEN_EXPIRED || decoded === TOKEN_INVALID;
}
exports.isTokenExpired = isTokenExpired;
//# sourceMappingURL=validator.js.map