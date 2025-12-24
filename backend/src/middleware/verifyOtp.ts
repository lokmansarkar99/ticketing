import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";

dotenv.config();

export const verifyOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { otpToken } = req.body;
    const token = otpToken;

    if (!token) return next(createError.Unauthorized("Access denied"));
    try {
        const verified = jwt.verify(token, process.env.OTP_TOKEN || "");
        req.user = verified;
        next();
    } catch (error) {
        console.log(error);
        next(
            createError.Unauthorized(`Time Expired Access denied`)
        );
    }
};