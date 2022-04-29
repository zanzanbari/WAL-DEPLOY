"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./authRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const router = (0, express_1.Router)();
router.use("/auth", authRouter_1.default);
router.use("/user", userRouter_1.default);
router.use("/test", (req, res) => {
    res.status(400).json("배포 test");
});
exports.default = router;
//# sourceMappingURL=index.js.map