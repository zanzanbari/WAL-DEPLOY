"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const mainController_1 = require("../controllers/mainController");
const router = (0, express_1.Router)();
router.use(auth_1.default.isAuth);
router.get('/main', mainController_1.mainController.getTodayWals);
exports.default = router;
//# sourceMappingURL=mainRouter.js.map