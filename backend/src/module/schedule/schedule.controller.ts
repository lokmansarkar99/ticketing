import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findStation = await prisma.schedule.findFirst({
            where: {
                time: req.body.time
            }
        })
        if (findStation) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Schedule Already Exists'
            })
        }
        const result = await prisma.schedule.create({
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Schedule Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getScheduleAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.ScheduleWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { time: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.schedule.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.schedule.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Schedule retrieved Success',
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

export const getScheduleSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.schedule.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Schedule Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Schedule retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findSchedule = await prisma.schedule.findUnique({
            where: {
                id
            },
        })
        if (!findSchedule) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Schedule Not Found'
            })
        }
        const result = await prisma.schedule.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Schedule Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Schedule Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findSchedule = await prisma.schedule.findUnique({
            where: {
                id
            }
        })
        if (!findSchedule) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Schedule Not Found'
            })
        }
        if (req.body.time) {
            const findTime = await prisma.schedule.findFirst({
                where: {
                    time: req.body.time
                }
            })
            if (findTime && findSchedule.id !== findTime.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Time Already Exists'
                })
            }
        }


        const result = await prisma.schedule.update({
            where: {
                id,
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Schedule Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}