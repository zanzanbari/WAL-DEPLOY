"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const requestValidator_1 = __importDefault(require("../middlewares/requestValidator"));
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post("/set-info", requestValidator_1.default.initRequestCheck, auth_1.default.isAuth, userController_1.userController.setInfo);
router
    .route("/info/nickname")
    .get(auth_1.default.isAuth, userController_1.userController.getNicknameInfo)
    .post(auth_1.default.isAuth, userController_1.userController.resetNicknameInfo);
router
    .route("/info/time")
    .get(auth_1.default.isAuth, userController_1.userController.getTimeInfo)
    .post(requestValidator_1.default.timeRequestCheck, auth_1.default.isAuth, userController_1.userController.resetTimeInfo);
router
    .route("/info/category")
    .get(auth_1.default.isAuth, userController_1.userController.getCategoryInfo)
    .post(requestValidator_1.default.categoryRequestCheck, auth_1.default.isAuth, userController_1.userController.resetUserCategoryInfo);
exports.default = router;
//# sourceMappingURL=userRouter.js.map