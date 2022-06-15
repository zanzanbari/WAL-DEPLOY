import { NextFunction, Request, Response } from "express";
import logger from "../../loaders/logger";
import sc from "../../constant/resultCode";
import rm from "../../constant/resultMessage";
import MainService from "../../services/main/mainService";
import { TodayWal, Item, Reservation } from "../../models";
import { ErrorResponse, SuccessResponse } from "../../common/apiResponse";

/**
 *  @메인화면
 *  @route GET /main
 *  @access public
 */

const getTodayWals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const mainServiceInstance = new MainService(TodayWal, Reservation, Item, logger);
    const data = mainServiceInstance.getMain( req.user?.id as number);

    SuccessResponse(res, sc.OK, rm.READ_TODAY_WAL_SUCCESS, await data);

  } catch (error){
    ErrorResponse(res, sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR);
    return next(error);
  }

}

const mainController = {
  getTodayWals
};

export default mainController;
