import { celebrate, Joi } from "celebrate";
import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

// router.get()
router.post(
    "/:social/login",
    // celebrate({
    //     params: Joi.object().keys({
    //         social: Joi.string().required()
    //     }),
    //     query: Joi.object({
    //         socialToken: Joi.string().token().required()
    //         // fcmToken: Joi.string().token().required() 
    //     })
    // }),
    authController.socialLogin
);

router.get("/logout", authController.logout);

export default router;