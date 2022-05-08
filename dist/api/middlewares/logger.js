"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createLogger, format, transports } = require('winston');
const path = require('path');
const mt = require('moment-timezone');
const date = mt().tz('Asia/Seoul');
const koreaTime = format((info) => {
    info.timestamp = date.format();
    return info;
});
const appLogger = createLogger({
    format: format.combine(format.timestamp({
        format: 'YY-MM-DD HH:mm:ss'
    }), format.splat(), format.printf(({ level, message }) => `${level}: ${message}`), format.json()),
    transports: [
        new transports.File({
            filename: path.join('log', 'app-error.log'),
            level: 'error'
        }),
        new transports.File({
            filename: path.join(`log`, date.format('YY-MM-DD'), 'app.log')
        }),
        new transports.Console()
    ],
});
const httpLogger = createLogger({
    format: format.combine(format.timestamp({
        format: 'YY-MM-DD HH:mm:ss'
    }), format.splat(), format.printf(({ level, message }) => `${level}: ${message}`)),
    transports: [
        new transports.File({
            filename: path.join('log', date.format('YY-MM-DD'), 'http.log')
        }),
        new transports.Console()
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