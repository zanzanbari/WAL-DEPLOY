import { Router } from "express";
import authRouter from "./authRouter";
import userRouter from "./userRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);

router.use("/test", (req, res)=> {
    res.status(400).json("배포 test");
})
export default router;