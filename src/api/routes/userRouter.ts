import { Router } from "express";
import authUtil from "../middlewares/auth";
import validateUtil from "../middlewares/requestValidator";
import { userController } from "../controllers/userController";

const router = Router();

router.post(
    "/set-info",
    validateUtil.initRequestCheck,
    authUtil.isAuth,
    userController.setInfo
);
router.get(
    "/info",
    authUtil.isAuth,
    userController.getInfo
);


export default router;