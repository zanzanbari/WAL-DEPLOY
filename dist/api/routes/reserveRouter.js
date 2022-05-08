"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const reserveController_1 = require("../controllers/reserveController");
const router = (0, express_1.Router)();
router.use(auth_1.default.isAuth);
router
    .route('/')
    .get(reserveController_1.reserveController.getReservation)
    .post(reserveController_1.reserveController.postReservation);
router.get('/datepicker', reserveController_1.reserveController.getReservedDate);
router.delete('/:postId', reserveController_1.reserveController.deleteReservation);
router.delete('/completed/:postId', reserveController_1.reserveController.deleteCompletedReservation);
exports.default = router;
//# sourceMappingURL=reserveRouter.js.map