"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = exports.ErrorResponse = void 0;
const ErrorResponse = (res, resultCode, resultMessage) => {
    res.status(resultCode).json({
        resultCode,
        resultMessage
    });
};
exports.ErrorResponse = ErrorResponse;
const SuccessResponse = (res, resultCode, resultMessage, data) => {
    data.resultCode = resultCode;
    data.resultMessage = resultMessage,
        res.status(resultCode).json(data);
};
exports.SuccessResponse = SuccessResponse;
//# sourceMappingURL=apiResponse.js.map