import { Router } from "express";
import authUtil from "../middlewares/auth";
import { authController } from "../controllers/authController";
import validateUtil from "../middlewares/requestValidator";

const router = Router();

// router.get()
router.post(
    "/:social/login", 
    validateUtil.toLogin,
    authController.socialLogin
);
router.get(
    "/logout", 
    authUtil.isAuth, 
    authController.logout
);
router.post("/reissue/token", authController.reissueToken);

export default router;