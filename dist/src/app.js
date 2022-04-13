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
const celebrate_1 = require("celebrate");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = __importDefault(require("./api/routes"));
const db_1 = require("./loaders/db");
const swagger_api_json_1 = __importDefault(require("../custom/swagger/swagger-api.json"));
function startServer() {
    const app = (0, express_1.default)();
    const logger = require('./api/middlewares/logger');
    const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined";
    // db 연결
    (0, db_1.connectDB)();
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)('HTTP/:http-version :method :url :status', {
        stream: logger.httpLogStream
    })); // NOTE: http request 로그 남기기
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    // 라우팅
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_api_json_1.default, { explorer: true }));
    app.use((0, celebrate_1.errors)());
    app.use("/api/v1", routes_1.default);
    app.use("*", (req, res) => {
        res.status(404).json({
            status: 404,
            success: false,
            message: "잘못된 경로입니다."
        });
        //app log 남기기
        const err = new Error(`잘못된 경로입니다.`);
        logger.appLogger.log({
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
        logger.appLogger().log({
            level: 'error',
            message: err.message
        });
        process.exit(1);
    });
}
startServer();
//# sourceMappingURL=app.js.map