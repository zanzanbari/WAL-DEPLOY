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

router.use("/info", authUtil.isAuth);
router
    .route("/nickname")
    .get(userController.getNicknameInfo)
    .post(userController.resetNicknameInfo);

router.route("/time")
    .get(userController.getTimeInfo)
    .post(validateUtil.timeRequestCheck, 
        userController.resetTimeInfo
    );
        
router.route("/category")
    .get(userController.getCategoryInfo)
    .post(userController.resetUserCategoryInfo);


export default router;