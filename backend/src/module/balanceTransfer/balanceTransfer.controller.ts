import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";

export const createBalanceTransfer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transaction = await prisma.$transaction(async (prisma) => {

            const fromAccount = await prisma.account.findUnique({
                where: { id: req.body.fromAccountId }
            })
            if (!fromAccount) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'From Account Not Found'
                })
            }
            const toAccount = await prisma.account.findUnique({
                where: { id: req.body.toAccountId }
            })
            if (!toAccount) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'To Account Not Found'
                })
            }
            const result = await prisma.balanceTransfer.create({
                data: req.body
            });
            await prisma.account.update({
                where: { id: fromAccount.id },
                data: {
                    currentBalance: fromAccount.currentBalance - req.body.amount
                }
            })
            await prisma.account.update({
                where: { id: toAccount.id },
                data: {
                    currentBalance: toAccount.currentBalance + req.body.amount
                }
            })
            return result;
        },
            {
                maxWait: 500000,
                timeout: 1000000,
            }
        )
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Balance Transfer done',
            data: transaction
        })
    }
    catch (err) {
        next(err)
    }
}

export const getBalanceTransfer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;

        if (skip < 0) {
            skip = 0;
        }
        const result = await prisma.balanceTransfer.findMany({
            skip: skip * take,
            take,
        })
        const total = await prisma.balanceTransfer.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Balance Transfer retrieved Success',
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

export const getBalanceTransferById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findBalanceTransfer = await prisma.balanceTransfer.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if (!findBalanceTransfer) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Balance Transfer Not Found'
            })
        }

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Balance Transfer retrieved Success',
            data: findBalanceTransfer
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteBalanceTransfer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transaction = await prisma.$transaction(async (prisma) => {
            const findBalanceTransfer = await prisma.balanceTransfer.findUnique({
                where: {
                    id: Number(req.params.id)
                }
            });
            if (!findBalanceTransfer) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'Balance Transfer Not Found'
                })
            }
            const fromAccount = await prisma.account.findUnique({
                where: { id: findBalanceTransfer.fromAccountId }
            })
            if (!fromAccount) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'From Account Not Found'
                })
            }
            const toAccount = await prisma.account.findUnique({
                where: { id: findBalanceTransfer.toAccountId }
            })
            if (!toAccount) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'To Account Not Found'
                })
            }

            await prisma.account.update({
                where: { id: findBalanceTransfer.fromAccountId },
                data: {
                    currentBalance: fromAccount.currentBalance + findBalanceTransfer.amount
                }
            })
            await prisma.account.update({
                where: { id: findBalanceTransfer.toAccountId },
                data: {
                    currentBalance: toAccount.currentBalance - findBalanceTransfer.amount
                }
            })
            await prisma.balanceTransfer.delete({
                where: {
                    id: findBalanceTransfer.id
                }
            });
        },
            {
                maxWait: 500000,
                timeout: 1000000,
            }
        )
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Balance Transfer deleted Successfully'
        })
    }
    catch (err) {
        next(err)
    }
}