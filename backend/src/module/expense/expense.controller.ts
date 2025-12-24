import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const { id } = req.user;
        if (data.expenseType === "Fuel") {
            if (!data.fuelCompanyId || !data.fuelWeight || !data.fuelPrice) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Fuel expense requires fuel company id fuel weight fuel price'
                })
            }

        }

        const result = await prisma.expense.create({
            data
        })

        if (result.expenseType === "Fuel") {
            const findCoachConfig = await prisma.coachConfig.findUnique({
                where: {
                    id: result.coachConfigId,
                }
            })
            const findDue = await prisma.dueTable.findFirst({
                where: {
                    registrationNo: findCoachConfig?.registrationNo as string,
                    fuelCompanyId: result.fuelCompanyId as number
                }
            })
            let currentDueAmount = result.dueAmount;
            if (findDue) {
                const updateDue = await prisma.dueTable.update({
                    where: {
                        id: findDue.id
                    },
                    data: {
                        due: {
                            increment: result.dueAmount,
                        }
                    }
                })
                currentDueAmount = updateDue.due;
            } else {
                await prisma.dueTable.create({
                    data: {
                        registrationNo: findCoachConfig?.registrationNo as string,
                        fuelCompanyId: result.fuelCompanyId as number,
                        due: result.dueAmount,
                    }
                })
            }
            await prisma.fuelPayment.create({
                data: {
                    coachConfigId: result.coachConfigId,
                    registrationNo: findCoachConfig?.registrationNo as string,
                    userId: id,
                    fuelCompanyId: result.fuelCompanyId!,
                    date: result.date,
                    currentDueAmount,
                    expenseId: result.id,
                    paidAmount: result.paidAmount,
                    amount: result.amount,
                    fuelWeight: result.fuelWeight,
                    fuelPrice: result.fuelPrice,
                }
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getExpenseAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.ExpenseWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { file: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.expense.findMany({
            where: {
                AND: whereCondition
            },
            include: {

                coachConfig: {
                    select: {
                        coachNo: true,
                    }
                },
                expenseCategory: {
                    select: {
                        name: true
                    }
                },
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.expense.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense retrieved Success',
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

export const getExpenseAccountsDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.ExpenseWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { file: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.expense.findMany({
            where: {
                AND: whereCondition,
                authorizeStatus: false,
            },
            include: {
                coachConfig: {
                    select: {
                        coachNo: true,
                    }
                },
                expenseCategory: {
                    select: {
                        name: true
                    }
                },
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.expense.count({
            where: {
                AND: whereCondition,
                authorizeStatus: false,
            },
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense retrieved Success',
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

export const getExpenseSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.expense.findUnique({
            where: {
                id
            },
            include: {

                coachConfig: {
                    select: {
                        coachNo: true,
                    }
                },
                expenseCategory: {
                    select: {
                        name: true
                    }
                },
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Expense retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findOrder = await prisma.expense.findUnique({
            where: {
                id
            },
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Not Found'
            })
        }

        const result = await prisma.expense.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Expense Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const {id:userId} = req.user;
        const id = Number(req.params.id)
        const findExpense = await prisma.expense.findUnique({
            where: {
                id
            },
            include: {
                FuelPayment: {
                    select: {
                        id: true,
                    }
                },
                coachConfig: {
                    select: {
                        registrationNo: true,
                    }
                }
            },

        })
        if (!findExpense) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Not Found'
            })
        }

        let dueAmount = findExpense.dueAmount;

        if (!findExpense.edit) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Expense cannot be updated'
            })

        }

        if (data.expenseType === "Fuel" && !data.fuelCompanyId) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Fuel expense requires fuel company id'
            })
        }
        const result = await prisma.expense.update({
            where: {
                id
            },
            data
        })
        if (result.expenseType === "Fuel") {

            const findDue = await prisma.dueTable.findFirst({
                where: {
                    registrationNo: findExpense.coachConfig.registrationNo as string,
                    fuelCompanyId: findExpense.fuelCompanyId as number,

                }
            })

            let currentDueAmount = result.dueAmount;
            if (findDue) {
                await prisma.dueTable.update({
                    where: {
                        id: findDue.id,
                    },
                    data: {
                        due: {
                            decrement: dueAmount,
                        }
                    }
                })
                const updateDue = await prisma.dueTable.update({
                    where: {
                        id: findDue.id,
                    },
                    data: {
                        due: {
                            increment: result.dueAmount,
                        }
                    }
                })
                currentDueAmount = updateDue.due
            }

            await prisma.fuelPayment.update({
                where: {
                    id: findExpense.FuelPayment[0].id
                },
                data: {
                    coachConfigId: result.coachConfigId,
                    userId,
                    fuelCompanyId: result.fuelCompanyId!,
                    date: result.date,
                    currentDueAmount,
                    expenseId: result.id,
                    paidAmount: result.paidAmount,
                    amount: result.amount,
                }
            })
        }


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const authorizeExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const expenseId = Number(req.params.id)
        const { edit, accounts } = req.body;
        if (edit) {
            await prisma.expense.update({
                where: {
                    id: expenseId
                },
                data: {
                    edit: true
                }
            })
        } else {
            if (!accounts.length) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Accounts is required'
                })
            }
            for (let acc of accounts) {
                const findAccount = await prisma.account.findUnique({
                    where: {
                        id: acc.accountId
                    }
                })
                if (!findAccount) {
                    return res.status(400).send({
                        success: false,
                        statusCode: 400,
                        message: 'Account not found'
                    })
                }
                await prisma.account.update({
                    where: {
                        id: findAccount.id
                    },
                    data: {
                        currentBalance: {
                            increment: acc.amount
                        }
                    }
                })
            }
            const { id } = req.user;
            const findExpense = await prisma.expense.findUnique({
                where: {
                    id: expenseId
                }
            })
            if (!findExpense) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'Expense Not Found'
                })
            }



            const result = await prisma.expense.update({
                where: {
                    id: expenseId,
                },
                data: {
                    authorizeStatus: true,
                    authorizeBy: id
                }
            })
        }

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Authorize Success',
        })
    }
    catch (err) {
        next(err)
    }
}