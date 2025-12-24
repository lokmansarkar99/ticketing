import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createExpenseSubCategoryAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {...data } = req.body;
        const findCategory = await prisma.expenseSubCategoryAccounts.findFirst({
            where: {
                expenseCategoryId: data.expenseCategoryId,
                name: data.name
            }
        })
        if (findCategory) {
            return res.status(400).send({
                success: false,
                statusCode: 200,
                message: 'Expense Sub Category Accounts Name already exists',
            })
        }
       
        const result = await prisma.expenseSubCategoryAccounts.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Sub Category Accounts Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const getExpenseSubCategoryAccountsAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.ExpenseSubCategoryAccountsWhereInput[] = [];

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
        const result = await prisma.expenseSubCategoryAccounts.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.expenseSubCategoryAccounts.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Sub Category Accounts retrieved Success',
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


export const getExpenseSubCategoryAccountsSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.expenseSubCategoryAccounts.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Sub Category Accounts Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Expense Sub Category Accounts retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateExpenseSubCategoryAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await prisma.expenseSubCategoryAccounts.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            message: "Expense Sub Category Accounts Update Success",
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const deleteExpenseSubCategoryAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await prisma.expenseSubCategoryAccounts.delete({ where: { id: Number(req.params.id) } })
        res.status(200).send({
            success: true,
            message: "Expense Sub Category Accounts Delete Success",
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}