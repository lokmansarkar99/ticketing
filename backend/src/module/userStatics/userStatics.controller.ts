import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export const createUserStatics = async (req: Request, res: Response, next: NextFunction) => {
    try {
       
        const result = await prisma.userStatics.create({
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'User Statics Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const getUserStaticsAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.UserStaticsWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        const result = await prisma.userStatics.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.userStatics.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All User Statics retrieved Success',
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

export const getUserStaticsSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.userStatics.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'User Statics Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single User Statics retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteUserStatics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findUserStatics = await prisma.userStatics.findUnique({
            where: {
                id
            },
        })
        if (!findUserStatics) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'User Statics Not Found'
            })
        }
        const result = await prisma.userStatics.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'User Statics Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'User Statics Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateUserStatics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findUserStatics = await prisma.userStatics.findUnique({
            where: {
                id
            }
        })
        if (!findUserStatics) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'User Statics Not Found'
            })
        }


        const result = await prisma.userStatics.update({
            where: {
                id,
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'User Statics Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}