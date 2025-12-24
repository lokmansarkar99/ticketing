import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createExpenseCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const findCategory = await prisma.expenseCategory.findFirst({
            where: {
                name: data.name
            }
        })
        if (findCategory) {
            return res.status(400).send({
                success: false,
                statusCode: 200,
                message: 'Expense Category Name already exists',
            })
        }
        const result = await prisma.expenseCategory.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Category Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getExpenseCategoryAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.ExpenseCategoryWhereInput[] = [];

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
        const result = await prisma.expenseCategory.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.expenseCategory.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Category retrieved Success',
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

export const getExpenseCategorySingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.expenseCategory.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Category Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Expense Category retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const deleteExpenseCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findOrder = await prisma.expenseCategory.findUnique({
            where: {
                id
            },
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Category Not Found'
            })
        }

        const result = await prisma.expenseCategory.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Expense Category Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Category Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateExpenseCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findOrder = await prisma.expenseCategory.findUnique({
            where: {
                id
            }
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Category Not Found'
            })
        }


        const result = await prisma.expenseCategory.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Category Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}