"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = exports.ErrorResponse = void 0;
const ErrorResponse = (res, status, message) => {
    res.status(status).json({
        status,
        message
    });
};
exports.ErrorResponse = ErrorResponse;
const SuccessResponse = (res, status, message, data) => {
    res.status(status).json({
        status,
        message,
        data
    });
};
exports.SuccessResponse = SuccessResponse;
//# sourceMappingURL=apiResponse.js.map