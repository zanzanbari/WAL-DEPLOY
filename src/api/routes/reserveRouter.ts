import { Router } from "express";
import authUtil from "../middlewares/auth";
import validateUtil from "../middlewares/requestValidator";
import { reserveController } from "../controllers/reserveController";

const router = Router();

router.use(authUtil.isAuth);

router
    .route('/')
    .get(reserveController.getReservation)
    .post(validateUtil.reserveRequestCheck, reserveController.postReservation);

router.get('/datepicker', reserveController.getReservedDate);

router.delete('/:postId', reserveController.deleteReservation);

router.delete('/completed/:postId', reserveController.deleteCompletedReservation);

export default router;
