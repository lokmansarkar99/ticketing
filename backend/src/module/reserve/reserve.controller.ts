import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createReserve = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {...data } = req.body;
        data.dueAmount = data.amount - data.paidAmount;
        if (data.noOfSeat === 41) {
            data.coachClass = "E_Class"
        } else if (data.noOfSeat === 28) {
            data.coachClass = "B_Class"
        } else if (data.noOfSeat === 43) {
            data.coachClass = "S_Class"
        } else if (data.noOfSeat === 30) {
            data.coachClass = "Sleeper"
        }
       
        const result = await prisma.reserve.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Reserve Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getReserveAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.ReserveWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { registrationNo: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.reserve.findMany({
            where: {
                AND: whereCondition
            },
            include:{
                route: true
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.reserve.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Reserve retrieved Success',
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

export const getReserveSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.reserve.findUnique({
            where: {
                id
            },
            include:{
                route: true
            }
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Reserve Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Reserve retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteReserve = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findOrder = await prisma.reserve.findUnique({
            where: {
                id
            },
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Reserve Not Found'
            })
        }
       
        const result = await prisma.reserve.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Reserve Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Reserve Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateReserve = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findReserve = await prisma.reserve.findUnique({
            where: {
                id
            }
        })
        if (!findReserve) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Reserve Not Found'
            })
        }


        const result = await prisma.reserve.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Reserve Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}