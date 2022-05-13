import { NextFunction, Request, Response } from "express";
import logger from "../middlewares/logger";
import { TodayWal, Item, Reservation } from "../../models";
import { ErrorResponse, SuccessResponse } from "../../modules/apiResponse";
import sc from "../../constant/resultCode";
import rm from "../../constant/resultMessage";

const getMainResponse = async (
    todayWals: TodayWal[]
) => {
    try {
        const todayWal : any[] = [];

        for (const wal of todayWals) {
            let type, content, canOpen;

            if (wal.getDataValue("userDefined")) { //직접 추가한 예약이라면
                type = "스페셜";
                const reservationId = wal.getDataValue("reservation_id")
                const reservation = await Reservation.getReservationById(reservationId);
                content = reservation?.content;
                const time = wal.getDataValue("time") as Date;
    
                canOpen = new Date() >= time ? true : false;
    
            } else {
                const time = wal.getDataValue("time") as Date;
               console.log(time, time.getUTCHours()); 
                if (time.getHours() == 8) type = "아침";
                else if (time.getHours() == 14) type = "점심";
                else type = "저녁";
    
                const itemId = wal.getDataValue("item_id");
                const item = await Item.getItemById(itemId);
                content = item?.content;
    
                canOpen = new Date() >= time ? true : false;
            }

            todayWal.push( {
                type,
                content,
                canOpen
            } )
        }
        return todayWal

    } catch (err) {
        logger.appLogger.log({ level: "error", message: err.message });
    }
}
const getTodayWals = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id as number;
        
        const todayWals = await TodayWal.getTodayWalsByUserId(userId);
        
        const todayWal = await getMainResponse(todayWals);

        SuccessResponse(res, sc.OK, rm.READ_TODAY_WAL_SUCCESS, {todayWal});

    } catch (err){
        logger.appLogger.log({ level: "error", message: err.message });
        ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
        return next(err);
    }

}

export const mainController = {
    getTodayWals
}
