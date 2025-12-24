import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export const createSeat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findSeat = await prisma.seat.findUnique({
            where: {
                name: req.body.name
            }
        })
        if (findSeat) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Seat Already Exists'
            })
        }
        const result = await prisma.seat.create({
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Seat Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const getSeatAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.SeatWhereInput[] = [];

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
        const result = await prisma.seat.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.seat.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Seat retrieved Success',
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

export const getSeatSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.seat.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Seat Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Seat retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteSeat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findSeat = await prisma.seat.findUnique({
            where: {
                id
            },
        })
        if (!findSeat) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Seat Not Found'
            })
        }
        const result = await prisma.seat.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Seat Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Seat Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateSeat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findSeat = await prisma.seat.findUnique({
            where: {
                id
            }
        })
        if (!findSeat) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'seat Not Found'
            })
        }
        if (req.body.name) {
            const findName = await prisma.seat.findFirst({
                where: {
                    name: req.body.name
                }
            })
            if (findName && findSeat.id !== findName.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Name Already Exists'
                })
            }
        }


        const result = await prisma.seat.update({
            where: {
                id,
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Seat Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}