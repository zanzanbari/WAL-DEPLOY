import { NextFunction, Request, Response } from "express";
import { Item, Time, User, UserCategory, Reservation } from "../../models";
import { ErrorResponse, SuccessResponse } from "../../modules/apiResponse";
import sc from "../../constant/resultCode";
import rm from "../../constant/resultMessage";

//import {  } from "../../interface/dto/request/reserveRequest";
//import {  } from "../../interface/dto/response/reserveResponse";
import ReserveService from "../../services/user/userService";
import logger from "../middlewares/logger";
import dayjs from "dayjs";

const dayArr = ["(일)","(월)","(화)","(수)","(목)","(금)","(토)"];

const getHistoryDateMessage = (
    rawDate: Date
) => {
    try {

        const monthDate = dayjs(rawDate).format("MM. DD") as string;
        let time = dayjs(rawDate).format(":mm") as string;
        
        if (dayjs(rawDate).hour() >= 12) {
            time = ` 오후 ${dayjs(rawDate).hour() - 12}` + time;
        } else {
            time = ` 오전 ${dayjs(rawDate).hour()}` + time;
        }
        const day = dayArr[dayjs(rawDate).day()] as string;

        return {
            monthDate,
            day,
            time
        }

    } catch (err){
        logger.appLogger.log({ level: "error", message: err.message });
    }

}

const pushEachItems = (
    Items: Reservation[],
    DataArr : any[],
    completed: boolean
) => {
    try {
    
        for (const item of Items) {
            const rawDate = item.getDataValue("sendingDate") as Date;
            const historyMessage = getHistoryDateMessage(rawDate);
            
            const sendingDate = historyMessage?.monthDate + " " + historyMessage?.day + historyMessage?.time + (!completed? " • 전송 예정" : " • 전송 완료");

            DataArr.push({
                postId: item.id,
                sendingDate,
                content: item.getDataValue("content"),
                reservedAt: dayjs(item.getDataValue("reservedAt")).format("YYYY. MM. DD"),
                ...(!completed && {hidden: item.getDataValue("hide")}) //!completed인 경우에만 obj에 hidden속성이 들어감
            });
        }

    } catch (err){
        logger.appLogger.log({ level: "error", message: err.message });
    }

}

const getReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const sendingData : any[] = [], completeData : any[] = [];

        const data = {
            sendingData,
            completeData
        };

        const sendingDataItems = await Reservation.getSendingItems(req.user?.id as number);
        const completeDataItems = await Reservation.getCompletedItems(req.user?.id as number);

        if (sendingDataItems.length < 1 && completeDataItems.length < 1) {
            SuccessResponse(res, sc.OK, rm.NO_RESERVATION, data);
        }

        pushEachItems(sendingDataItems, sendingData, false);
        pushEachItems(completeDataItems, completeData, true);
        
        SuccessResponse(res, sc.OK, rm.READ_RESERVATIONS_SUCCESS, data);
       

    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(err);
    }
}


const postReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        
        const {
            content,
            hide,
            date,
            time
        } = req.body;

        if (!content || hide == undefined || !date || !time) 
            return ErrorResponse(res, sc.BAD_REQUEST, rm.NULL_VALUE);

        const existingDate = await Reservation.getReservationByDate(req.user?.id as number, date as string);
        
        if (existingDate) return ErrorResponse(res, sc.BAD_REQUEST, rm.INVALID_RESERVATION_DATE);

     
        const newReservationId = await Reservation.postReservation(
            req.user?.id as number, 
            date as string, 
            time as string, 
            hide as boolean, 
            content as string
        );

        const data = { postId: newReservationId };

        /**
         * -----------------------------알림 보내는 기능 넣어야 한다 ---------------------------
         * 
         */
        SuccessResponse(res, sc.OK, rm.ADD_RESERVATION_SUCCESS, data);


    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(err);
    }
}


const getReservedDate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        const date = [] as string[];
        const data = { date }

        const reservedDateItems = await Reservation.getReservationsFromTomorrow(req.user?.id as number);

        if (reservedDateItems.length < 1) {
            SuccessResponse(res, sc.OK, rm.NO_RESERVATION_DATE, data);
        }

        for (const item of reservedDateItems) {
            const reservedDate = item.getDataValue("sendingDate") as Date;
            date.push(dayjs(reservedDate).format("YYYY-MM-DD"));
        }

        data.date = date.sort();


        SuccessResponse(res, sc.OK, rm.READ_RESERVED_DATE_SUCCESS, data);
   

    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(err);
    }
}

const deleteReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const postId = req.params.postId;
    if (postId == ":postId")
        return ErrorResponse(res, sc.BAD_REQUEST, rm.WRONG_PARAMS_OR_NULL);

    try {

        const waitingReservation = await Reservation.getReservationByPostId(
            parseInt(postId), 
            req.user?.id as number, 
            false
        );

        if (!waitingReservation)
            return ErrorResponse(res, sc.NOT_FOUND, rm.NO_OR_COMPLETED_RESERVATION);
        
        /** 
         * -------------------------------
            schedule에서 해당 reservation 삭제!!!!!!!!!!!!!!!!!
            -------------------------------
        **/

        await waitingReservation?.destroy();

        const data = { postId: parseInt(postId) }
        SuccessResponse(res, sc.OK, rm.DELETE_RESERVATION_SUCCESS, data);


    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(err);
    }
}

const deleteCompletedReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const postId = req.params.postId;
    if (postId == ":postId")
        return ErrorResponse(res, sc.BAD_REQUEST, rm.WRONG_PARAMS_OR_NULL);

    try {

        const completedReservation = await Reservation.getReservationByPostId(
            parseInt(postId), 
            req.user?.id as number, 
            true
        );

        if (!completedReservation)
            return ErrorResponse(res, sc.NOT_FOUND, rm.NO_OR_UNCOMPLETED_RESERVATION);
        
        await completedReservation?.destroy();

        const data = { postId: parseInt(postId) }
        SuccessResponse(res, sc.OK, rm.DELETE_COMPLETED_RESERVATION_SUCCESS, data);

    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(err);
    }
}


export const reserveController = {
    getReservation,
    postReservation,
    getReservedDate,
    deleteReservation,
    deleteCompletedReservation
}