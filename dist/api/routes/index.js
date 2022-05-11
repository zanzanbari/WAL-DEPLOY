"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./authRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const reserveRouter_1 = __importDefault(require("./reserveRouter"));
const mainRouter_1 = __importDefault(require("./mainRouter"));
const router = (0, express_1.Router)();
router.use("/auth", authRouter_1.default);
router.use("/user", userRouter_1.default);
router.use("/reserve", reserveRouter_1.default);
router.use("/main", mainRouter_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map