"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenExpired = exports.passwordValidator = void 0;
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
function isTokenExpired(decoded) {
    return decoded === TOKEN_EXPIRED || decoded === TOKEN_INVALID;
}
exports.isTokenExpired = isTokenExpired;
//# sourceMappingURL=validator.js.map