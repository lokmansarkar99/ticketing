import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";

export const updatePartialInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.partialInfo.update({
            where: {
                id,
            },
            data: req.body,
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Partial Info Updated Success",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
}


export const getPartialInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await prisma.partialInfo.findFirst();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Get Partial Info Success",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
}