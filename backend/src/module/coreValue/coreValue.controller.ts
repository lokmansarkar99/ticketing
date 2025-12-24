import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export const createCoreValue = async (req: Request, res: Response, next: NextFunction) => {
    try {
       
        const result = await prisma.coreValue.create({
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Core Value Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const getCoreValueAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.CoreValueWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        
        const result = await prisma.coreValue.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.coreValue.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Core Value retrieved Success',
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

export const getCoreValueSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.coreValue.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Core Value Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Core Value retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteCoreValue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findCoreValue = await prisma.coreValue.findUnique({
            where: {
                id
            },
        })
        if (!findCoreValue) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Core Value Not Found'
            })
        }
        const result = await prisma.coreValue.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Core Value Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Core Value Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateCoreValue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findCoreValue = await prisma.coreValue.findUnique({
            where: {
                id
            }
        })
        if (!findCoreValue) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Core Value Not Found'
            })
        }
       


        const result = await prisma.coreValue.update({
            where: {
                id,
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Core Value Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}