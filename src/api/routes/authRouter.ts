import { Router } from "express";
import authUtil from "../middlewares/auth";
import { authController } from "../controllers/authController";
// import validateUtil from "../middlewares/requestValidator";

const router = Router();

// router.get()
router.post(
    "/:social/login",
    // celebrate({
    //     params: Joi.object().keys({
    //         social: Joi.string().required()
    //     }).validate({}),
    //     query: Joi.object({
    //         socialToken: Joi.string().token().required()
    //         // fcmToken: Joi.string().token().required() 
    //     })
    // }),
    authController.socialLogin
);
router.post("/:social/logout", authUtil.isAuth, authController.socialResign);
router.get("/logout", authUtil.isAuth, authController.logout);
router.post("/reissue/token", authController.reissueToken);

export default router;