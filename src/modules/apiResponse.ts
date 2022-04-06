import { Response } from "express";

export const ErrorResponse = (
    res: Response, 
    resultCode: number, 
    resultMessage: string
) => {
    res.status(resultCode).json({
        resultCode,
        resultMessage
    });
};

export const SuccessResponse = (
    res: Response,
    resultCode: number,
    resultMessage: string,
    data: any,
) => {
    data.resultCode = resultCode;
    data.resultMessage = resultMessage,
    res.status(resultCode).json(data);
}