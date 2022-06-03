import { Response } from "express";

export const ErrorResponse = (
    res: Response, 
    status: number, 
    message: string
) => {
    res.status(status).json({
        status,
        message
    });
};

export const SuccessResponse = (
    res: Response,
    status: number,
    message: string,
    data: any,
) => {
    res.status(status).json({
        status,
        message,
        data
    });
}