import { Router } from "express";
import authUtil from "../middlewares/auth";
import validateUtil from "../middlewares/requestValidator";
import { userController } from "../controllers/userController";

const router = Router();

router.post(
    "/set-info",
    validateUtil.loginCheck,
    authUtil.isAuth,
    userController.setInfo
);


export default router;