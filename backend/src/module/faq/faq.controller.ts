import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export const createFAQ = async (req: Request, res: Response, next: NextFunction) => {
    try {
       
        const result = await prisma.fAQ.create({
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'FAQ Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const getFAQAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.FAQWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        
        const result = await prisma.fAQ.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.fAQ.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All FAQ retrieved Success',
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

export const getFAQSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.fAQ.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'FAQ Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single FAQ retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteFAQ = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findFAQ = await prisma.fAQ.findUnique({
            where: {
                id
            },
        })
        if (!findFAQ) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'FAQ Not Found'
            })
        }
        const result = await prisma.fAQ.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'FAQ Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'FAQ Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateFAQ = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findFAQ = await prisma.fAQ.findUnique({
            where: {
                id
            }
        })
        if (!findFAQ) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'FAQ Not Found'
            })
        }
       


        const result = await prisma.fAQ.update({
            where: {
                id,
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'FAQ Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}