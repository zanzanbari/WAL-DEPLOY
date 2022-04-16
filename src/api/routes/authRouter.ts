import { Router } from "express";
import authUtil from "../middlewares/auth";
import { authController } from "../controllers/authController";
import validateUtil from "../middlewares/requestValidator";

const router = Router();

router.post(
    "/:social/login", 
    validateUtil.loginCheck,
    authController.socialLogin
);
router.post(
    "/:social/logout",
    validateUtil.loginCheck,
    authUtil.isAuth, 
    authController.socialResign
);
router.get(
    "/logout", 
    authUtil.isAuth, 
    authController.logout
);
router.get(
    "/logout", 
    authUtil.isAuth, 
    authController.logout
);
router.post("/reissue/token", authController.reissueToken);

export default router;