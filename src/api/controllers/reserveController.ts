import { NextFunction, Request, Response } from "express";
import { Reservation, TodayWal } from "../../models";
import logger from "../../loaders/logger";
import sc from "../../constant/resultCode";
import rm from "../../constant/resultMessage";
import customError from "../../constant/responseError";
import queueEvent from "../../services/pushAlarm/event";
import ReserveService from "../../services/reserve/reserveService";
import { ISetReserveDto } from "../../dto/request/reserveRequest";
import { ErrorResponse, SuccessResponse } from "../../common/apiResponse";


/**
 *  @예약한_왈소리_히스토리
 *  @route GET /reserve
 *  @access public
 */

const getReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    
    const reserveServiceInstance = new ReserveService(Reservation, TodayWal, queueEvent, logger);
    const data = await reserveServiceInstance.getReservation(req.user?.id as number);

    if (data == "NO_RESERVATION") {
      return SuccessResponse(res, sc.OK, rm.NO_RESERVATION, []);
    } else {
      return SuccessResponse(res, sc.OK, rm.READ_RESERVATIONS_SUCCESS, data);
    }

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}

/**
 *  @왈소리_만들기
 *  @route POST /reserve
 *  @access public
 */

const postReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const reserveServiceInstance = new ReserveService(Reservation, TodayWal, queueEvent, logger);
    const data = await reserveServiceInstance.postReservation(req.user?.id as number, req.body as ISetReserveDto);

    if (data == customError.ALREADY_RESERVED_DATE) {
      return ErrorResponse(res, sc.BAD_REQUEST, rm.ALREADY_RESERVED_DATE);
    } else {
      return SuccessResponse(res, sc.OK, rm.ADD_RESERVATION_SUCCESS, data);
    }


  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }
  
}

/**
 *  @예약한_왈소리_날짜_확인
 *  @route GET /reserve/datepicker
 *  @access public
 */

const getReservedDate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

  try {

    const reserveServiceInstance = new ReserveService(Reservation, TodayWal, queueEvent, logger);
    const data = await reserveServiceInstance.getReservationOnCalender(req.user?.id as number);

    if (data == "NO_RESERVATION_DATE") {
      return SuccessResponse(res, sc.OK, rm.NO_RESERVATION_DATE, []);
    } else {
      return SuccessResponse(res, sc.OK, rm.READ_RESERVED_DATE_SUCCESS, data);
    }

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}

/**
 *  @왈소리_예약_취소
 *  @route DELETE /reserve/:postId
 *  @access public
 */

const deleteReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { postId } = req.params;
  if (postId == ":postId") {
    return ErrorResponse(res, sc.BAD_REQUEST, rm.WRONG_PARAMS_OR_NULL);
  }

  try {

    const reserveServiceInstance = new ReserveService(Reservation, TodayWal, queueEvent, logger);
    const data = await reserveServiceInstance.removeReservation(req.user?.id as number, parseInt(postId));

    if (data == customError.NO_OR_COMPLETED_RESERVATION) {
      return ErrorResponse(res, sc.NOT_FOUND, rm.NO_OR_COMPLETED_RESERVATION);
    } else {
      return SuccessResponse(res, sc.OK, rm.DELETE_RESERVATION_SUCCESS, data);
    }

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}

/**
 *  @전송된_왈소리_히스토리_삭제
 *  @route DELETE /reserve/completed/:postId
 *  @access public
 */

const deleteCompletedReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { postId } = req.params;
  if (postId == ":postId") {
    return ErrorResponse(res, sc.BAD_REQUEST, rm.WRONG_PARAMS_OR_NULL);
  }

  try {

    const reserveServiceInstance = new ReserveService(Reservation, TodayWal, queueEvent, logger);
    const data = await reserveServiceInstance.removeReservationHistory(req.user?.id as number, parseInt(postId));

    if (data == customError.NO_OR_UNCOMPLETED_RESERVATION) {
      return ErrorResponse(res, sc.NOT_FOUND, rm.NO_OR_UNCOMPLETED_RESERVATION);
    } else {
      return SuccessResponse(res, sc.OK, rm.DELETE_COMPLETED_RESERVATION_SUCCESS, data);
    }

  } catch (error) {
    logger.appLogger.log({ level: "error", message: error.message });
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}


export const reserveController = {
    getReservation,
    postReservation,
    getReservedDate,
    deleteReservation,
    deleteCompletedReservation
}