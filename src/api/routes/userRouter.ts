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

router
    .route("/info/nickname")
    .get(authUtil.isAuth, userController.getNicknameInfo)
    .post(authUtil.isAuth, userController.resetNicknameInfo);

router
    .route("/info/time")
    .get(authUtil.isAuth, userController.getTimeInfo)
    .post(validateUtil.timeRequestCheck,
        authUtil.isAuth,
        userController.resetTimeInfo
    );
        
router
    .route("/info/category")
    .get(authUtil.isAuth, userController.getCategoryInfo)
    .post(validateUtil.categoryRequestCheck, 
        authUtil.isAuth, 
        userController.resetUserCategoryInfo);


export default router;