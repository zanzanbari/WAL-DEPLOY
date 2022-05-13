"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./api/routes"));
const db_1 = require("./loaders/db");
const pushAlarm_1 = require("./services/pushAlarm");
const logger_1 = __importDefault(require("./api/middlewares/logger"));
function startServer() {
    const app = (0, express_1.default)();
    // db 연결
    (0, db_1.connectDB)();
    (0, pushAlarm_1.updateToday)(); //자정마다 todayWal 업데이트
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)('HTTP/:http-version :method :url :status', {
        stream: logger_1.default.httpLogStream
    })); // NOTE: http request 로그 남기기
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    // 라우팅
    app.use("/api/v1", routes_1.default);
    app.use("*", (req, res) => {
        res.status(404).json({
            status: 404,
            success: false,
            message: "잘못된 경로입니다."
        });
        //app log 남기기
        const err = new Error(`잘못된 경로입니다.`);
        logger_1.default.appLogger.log({
            level: 'error',
            message: err.message
        });
    });
    app.listen(8080, () => {
        console.log(`
        ################################################
        🛡️  Server listening on port 8080🛡️
        ################################################
      `);
    })
        .on("error", (err) => {
        logger_1.default.appLogger.log({
            level: 'error',
            message: err.message
        });
        process.exit(1);
    });
}
startServer();
//# sourceMappingURL=app.js.map