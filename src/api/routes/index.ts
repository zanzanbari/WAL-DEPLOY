import { Router } from "express";
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import reserveRouter from "./reserveRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/reserve", reserveRouter);

export default router;