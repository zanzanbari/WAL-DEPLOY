"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const authController_1 = require("../controllers/authController");
const requestValidator_1 = __importDefault(require("../middlewares/requestValidator"));
const router = (0, express_1.Router)();
// router.get()
router.post("/:social/login", requestValidator_1.default.toLogin, authController_1.authController.socialLogin);
router.get("/logout", auth_1.default.isAuth, authController_1.authController.logout);
router.post("/reissue/token", authController_1.authController.reissueToken);
exports.default = router;
//# sourceMappingURL=authRouter.js.map