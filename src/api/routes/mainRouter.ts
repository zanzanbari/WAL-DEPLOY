import { Router } from "express";
import authUtil from "../middlewares/auth";
import mainController from "../controllers/mainController";

const router = Router();

router.use(authUtil.isAuth);

router.get('/', mainController.getTodayWals);

router.patch('/:mainId', mainController.updateTodayWalShown);

export default router;