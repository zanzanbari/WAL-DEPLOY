import { Router } from "express";
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import reserveRouter from "./reserveRouter";
import mainRouter from "./mainRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/reserve", reserveRouter);
router.use("/main", mainRouter);

export default router;