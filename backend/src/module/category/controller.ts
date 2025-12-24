import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {...data } = req.body;
       
        const result = await prisma.category.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: ' Category Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const getCategoryAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.CategoryWhereInput[] = [];

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
        const result = await prisma.category.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.category.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Category retrieved Success',
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


export const getCategorySingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.category.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Category Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Category retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findCategory = await prisma.category.findUnique({
            where: {
                id
            },
        })
        if (!findCategory) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: ' Category Not Found'
            })
        }
       
        const result = await prisma.category.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Category Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Category Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findOrder = await prisma.category.findUnique({
            where: {
                id
            }
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Category Not Found'
            })
        }


        const result = await prisma.category.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Category Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}