import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";

export const createExpenseAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.user;
        const { payments, ...data } = req.body;
        const transaction = await prisma.$transaction(async (prisma) => {
            // data.expenseCategoryAccountsId = data.expenseCategoryId;
            // data.expenseSubCategoryAccountsId = data.expenseSubcategoryId;
            data.userId = id;
            console.log(data)
            const result = await prisma.expenseAccounts.create({ data })
            if (result) {
                if (payments?.length) {
                    for (const payment of payments) {
                        const paymentResult = await prisma.paymentAccounts.create({
                            data: {
                                userId: id,
                                accountId: payment.accountId,
                                paymentAmount: payment.paymentAmount,
                                expenseAccountId: result.id,
                                paymentType: "Expense",
                                paymentInOut: "OUT",
                            },
                        });
                        const accountId = payment.accountId;
                        if (accountId) {
                            const findAccount = await prisma.account.findUnique({
                                where: {
                                    id: accountId
                                }
                            })
                            if (findAccount) {
                                let newBalance = findAccount?.currentBalance - payment.paymentAmount;
                                await prisma.account.update({
                                    where: {
                                        id: accountId
                                    },
                                    data: {
                                        currentBalance: newBalance
                                    }
                                })
                            }

                        }
                    }
                }
            }
            return result;
        },
            {
                maxWait: 500000,
                timeout: 1000000,
            }
        )
        res.status(201).send({
            success: true,
            message: "Expense Accounts Create Success",
            data: transaction
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateExpenseAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await prisma.expenseAccounts.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            message: "ExpenseAccounts Update Success",
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getExpenseAccountsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await prisma.expenseAccounts.findFirst({
            where: { id: Number(req.params.id) },
            include: {
                expenseCategoryAccount: true,
                expenseSubCategoryAccount: true,
                PaymentAccounts: {
                    include: {
                        account: true
                    }
                },
            },
        })
        res.status(200).send({
            success: true,
            message: "Expense Accounts Get Success",
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const deleteExpenseAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findExpenseAccounts = await prisma.expenseAccounts.findUnique({
            where: {
                id: id
            }
        });
        if (!findExpenseAccounts) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: "Expense Accounts not found",
            })
        }
        const payments = await prisma.paymentAccounts.findMany({
            where: {
                expenseAccountId: id
            }
        })
        if (payments.length) {
            for (const p of payments) {
                const findAccount = await prisma.account.findUnique({
                    where: {
                        id: p.accountId
                    }
                })
                if (!findAccount) {
                    return res.status(404).send({
                        success: false,
                        statusCode: 404,
                        message: "Account not found",
                    })
                }
                const newBalance = findAccount.currentBalance + p.paymentAmount;
                await prisma.account.update({
                    where: {
                        id: p.accountId
                    },
                    data: {
                        currentBalance: newBalance
                    }
                })
            }
        }
        await prisma.paymentAccounts.deleteMany({
            where: {
                expenseAccountId: id
            }
        })
        const result = await prisma.expenseAccounts.delete({ where: { id } })
        res.status(200).send({
            success: true,
            message: "Expense Accounts Delete Success",
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const getExpenseAccountsAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = (parseInt(page as string) - 1) || 0;
        const take = (parseInt(size as string)) || 10;
        const order = (sortOrder as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';

        const whereCondition: Prisma.ExpenseAccountsWhereInput[] = []
        if (skip < 0) {
            skip = 0
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { date: { contains: search as string, } },
                ],
            });
        }

        let result: any[] = await prisma.expenseAccounts.findMany({
            where: {
                AND: whereCondition
            },
            include: {
                expenseCategoryAccount: true,
                expenseSubCategoryAccount: true,
                PaymentAccounts: {
                    include: {
                        account: true
                    }
                },
            },
            skip: skip * take,
            take,
            orderBy: {
                createdAt: 'desc',
            },
        });
    

    const total = await prisma.expenseAccounts.count();


    res.status(200).send({
        success: true,
        statusCode: 200,
        message: 'Expense Accounts Get All Successfully',
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


export const expenseAccountsReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = Number(req.query.category);
        const subcategoryId = Number(req.query.subcategory);
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();

        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        let result;
        let total;
        if (!Number.isNaN(categoryId) && Number.isNaN(subcategoryId)) {
            result = await prisma.expenseAccounts.findMany({
                where: {
                    expenseCategoryId: categoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]

                },
                include: {
                    expenseCategoryAccount: true,
                    expenseSubCategoryAccount: true
                }
            });
            total = await prisma.expenseAccounts.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    expenseCategoryId: categoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]

                },
            });
        } else if (Number.isNaN(categoryId) && !Number.isNaN(subcategoryId)) {
            result = await prisma.expenseAccounts.findMany({

                where: {
                    expenseSubCategoryId: subcategoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]

                },
                include: {
                    expenseCategoryAccount: true,
                    expenseSubCategoryAccount: true
                }
            });
            total = await prisma.expenseAccounts.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    expenseSubCategoryId: subcategoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]

                },
            });
        } else if (!Number.isNaN(categoryId) && !Number.isNaN(subcategoryId)) {
            result = await prisma.expenseAccounts.findMany({

                where: {
                    expenseSubCategoryId: subcategoryId,
                    expenseCategoryId: categoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]

                },
                include: {
                    expenseCategoryAccount: true,
                    expenseSubCategoryAccount: true
                }
            });
            total = await prisma.expenseAccounts.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    expenseSubCategoryId: subcategoryId,
                    expenseCategoryId: categoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]

                },
            });
        } else if (Number.isNaN(categoryId) && Number.isNaN(subcategoryId)) {
            result = await prisma.expenseAccounts.findMany({

                where: {
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]

                },
                include: {
                    expenseCategoryAccount: true,
                    expenseSubCategoryAccount: true
                }
            });
            total = await prisma.expenseAccounts.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]

                },
            });
        }



        res.status(200).send({
            success: true,
            message: "Get ExpenseAccounts Report Successfully",
            totalAmount: total?._sum?.totalAmount,
            data: result,
        })
    } catch (err) {
        next(err)
    }
}