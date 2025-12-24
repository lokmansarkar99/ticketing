import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createBus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {...data } = req.body;
       
        const result = await prisma.bus.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: ' Bus Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const getBusAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.BusWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { image: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.bus.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.bus.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Bus retrieved Success',
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


export const getBusSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.bus.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Bus Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Bus retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteBus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findBus = await prisma.bus.findUnique({
            where: {
                id
            },
        })
        if (!findBus) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: ' Bus Not Found'
            })
        }
       
        const result = await prisma.bus.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Bus Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Bus Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateBus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findOrder = await prisma.bus.findUnique({
            where: {
                id
            }
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Bus Not Found'
            })
        }


        const result = await prisma.bus.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Bus Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}