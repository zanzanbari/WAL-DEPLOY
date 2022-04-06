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
function startServer() {
    const app = (0, express_1.default)();
    const logger = (0, morgan_1.default)('dev');
    // db 연결
    // connectDB();
    app.use((0, cors_1.default)());
    app.use(logger);
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    // 라우팅
    app.use("/api", routes_1.default);
    app.use("*", (req, res) => {
        res.status(404).json({
            status: 404,
            success: false,
            message: "잘못된 경로입니다."
        });
    });
    app.listen(5050, () => {
        console.log(`
        ################################################
        🛡️  Server listening on port 🛡️
        ################################################
      `);
    })
        .on("error", err => {
        console.error(err);
        process.exit(1);
    });
}
startServer();
//# sourceMappingURL=app.js.map