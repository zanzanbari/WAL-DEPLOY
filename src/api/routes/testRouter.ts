import { Router } from "express";
import authUtil from "../middlewares/auth";
import mainController from "../controllers/mainController";

const router = Router();

router.use(authUtil.isAuth);

router.get('/category/items', mainController.getTodayWals);


export default router;