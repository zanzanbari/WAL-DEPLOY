"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const date = (0, moment_timezone_1.default)().tz('Asia/Seoul');
const koreaTime = (0, winston_1.format)((info) => {
    info.timestamp = date.format();
    return info;
});
const appLogger = (0, winston_1.createLogger)({
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: 'YY-MM-DD HH:mm:ss'
    }), winston_1.format.splat(), winston_1.format.printf(({ level, message }) => `${level}: ${message}`), winston_1.format.json()),
    transports: [
        new winston_1.transports.File({
            filename: path_1.default.join('log', 'app-error.log'),
            level: 'error'
        }),
        new winston_1.transports.File({
            filename: path_1.default.join(`log`, date.format('YY-MM-DD'), 'app.log')
        }),
        new winston_1.transports.Console()
    ],
});
const httpLogger = (0, winston_1.createLogger)({
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: 'YY-MM-DD HH:mm:ss'
    }), winston_1.format.splat(), winston_1.format.printf(({ level, message }) => `${level}: ${message}`)),
    transports: [
        new winston_1.transports.File({
            filename: path_1.default.join('log', date.format('YY-MM-DD'), 'http.log')
        }),
        new winston_1.transports.Console()
    ],
});
const httpLogStream = {
    write: (message) => {
        httpLogger.log({
            level: 'info',
            message: message,
        });
    },
};
exports.default = {
    appLogger,
    httpLogStream
};
//# sourceMappingURL=logger.js.map