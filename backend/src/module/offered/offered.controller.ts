import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export const createOffered = async (req: Request, res: Response, next: NextFunction) => {
    try {
       
        const result = await prisma.offered.create({
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Offered Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const getOfferedAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.OfferedWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        
        const result = await prisma.offered.findMany({
            where: {
                AND: whereCondition
            },
            include:{
                route:{
                    select:{
                        from: true,
                        to: true,
                    }
                }
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.offered.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Offered retrieved Success',
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

export const getOfferedSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.offered.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Offered Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Offered retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteOffered = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findOffered = await prisma.offered.findUnique({
            where: {
                id
            },
        })
        if (!findOffered) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Offered Not Found'
            })
        }
        const result = await prisma.offered.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Offered Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Offered Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateOffered = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findOffered = await prisma.offered.findUnique({
            where: {
                id
            }
        })
        if (!findOffered) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Offered Not Found'
            })
        }
       


        const result = await prisma.offered.update({
            where: {
                id,
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Offered Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}