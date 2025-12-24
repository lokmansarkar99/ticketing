import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createExpenseCategoryAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const findCategory = await prisma.expenseCategoryAccounts.findFirst({
            where: {
                name: data.name
            }
        })
        if (findCategory) {
            return res.status(400).send({
                success: false,
                statusCode: 200,
                message: 'Expense Category Accounts Name already exists',
            })
        }
        const result = await prisma.expenseCategoryAccounts.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Category Accounts Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getExpenseCategoryAccountsAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.ExpenseCategoryAccountsWhereInput[] = [];

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
        const result = await prisma.expenseCategoryAccounts.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.expenseCategoryAccounts.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Category Accounts retrieved Success',
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

export const getExpenseCategoryAccountsSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.expenseCategoryAccounts.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Category Accounts Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Expense Category Accounts retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const deleteExpenseCategoryAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findOrder = await prisma.expenseCategoryAccounts.findUnique({
            where: {
                id
            },
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Category Accounts Not Found'
            })
        }

        const result = await prisma.expenseCategoryAccounts.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Expense Category Accounts Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Category Accounts Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateExpenseCategoryAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findOrder = await prisma.expenseCategoryAccounts.findUnique({
            where: {
                id
            }
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Category Accounts Not Found'
            })
        }


        const result = await prisma.expenseCategoryAccounts.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Category Accounts Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}