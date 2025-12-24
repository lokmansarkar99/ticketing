import { NextFunction, Request, Response } from "express";

export const verifyAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { role } = req.user;

        if (role === "ADMIN") {
            return next();
        }
        return res.status(400).send({
            status: false, message: "You are not a admin"
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};