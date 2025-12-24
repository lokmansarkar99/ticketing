import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export const createSisterConcern = async (req: Request, res: Response, next: NextFunction) => {
    try {
       
        const result = await prisma.sisterConcern.create({
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Sister Concern Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const getSisterConcernAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.SisterConcernWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        
        const result = await prisma.sisterConcern.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.sisterConcern.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Sister Concern retrieved Success',
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

export const getSisterConcernSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.sisterConcern.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'SisterConcern Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Sister Concern retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteSisterConcern = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findSisterConcern = await prisma.sisterConcern.findUnique({
            where: {
                id
            },
        })
        if (!findSisterConcern) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Sister Concern Not Found'
            })
        }
        const result = await prisma.sisterConcern.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Sister Concern Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Sister Concern Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateSisterConcern = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findSisterConcern = await prisma.sisterConcern.findUnique({
            where: {
                id
            }
        })
        if (!findSisterConcern) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Sister Concern Not Found'
            })
        }
       


        const result = await prisma.sisterConcern.update({
            where: {
                id,
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Sister Concern Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}