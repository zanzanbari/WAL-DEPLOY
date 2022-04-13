"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// router.get()
router.post("/:social/login", 
// celebrate({
//     params: Joi.object().keys({
//         social: Joi.string().required()
//     }),
//     query: Joi.object({
//         socialToken: Joi.string().token().required()
//         // fcmToken: Joi.string().token().required() 
//     })
// }),
authController_1.authController.socialLogin);
router.get("/logout", authController_1.authController.logout);
exports.default = router;
//# sourceMappingURL=authRouter.js.map