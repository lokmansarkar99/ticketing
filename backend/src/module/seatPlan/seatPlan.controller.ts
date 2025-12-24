import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createSeatPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const findSeatPlan = await prisma.seatPlan.findUnique({
            where: {
                name: data.name
            }
        })
        if (findSeatPlan) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Seat Plan Already Exists'
            })
        }
        const result = await prisma.seatPlan.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Seat Plan Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getSeatPlanAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 20;
        const whereCondition: Prisma.SeatPlanWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { name: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.seatPlan.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.seatPlan.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Seat Plan retrieved Success',
            meta: {
                page: skip,
                size: take,
                total,
                totalPage: Math.ceil(total / take)
            },
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getSeatPlanSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.seatPlan.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Seat Plan Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Seat Plan retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteSeatPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findOrder = await prisma.seatPlan.findUnique({
            where: {
                id
            },
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Seat Plan Not Found'
            })
        }

        const result = await prisma.seatPlan.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Seat Plan Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Seat Plan Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateSeatPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findOrder = await prisma.seatPlan.findUnique({
            where: {
                id
            }
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Seat Plan Not Found'
            })
        }


        const result = await prisma.seatPlan.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Seat Plan Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}