import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { AccountType } from "@prisma/client";

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.currentBalance = req.body.openingBalance;
        const result = await prisma.account.create({ data: req.body })

        res.status(201).send({
            success: true,
            message: 'Account Created Done',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const result = await prisma.account.update({
            where: {
                id
            },
            data: req.body
        })
        res.status(201).send({
            success: true,
            message: 'Account Update Done',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getAccountsAll = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const type = req.query.type || "";
        let result;
        if (type === 'All') {
            result = await prisma.account.findMany()
        } else {
            result = await prisma.account.findMany({
                where: {
                    accountType: type as AccountType
                }
            })
        }
        res.status(201).send({
            success: true,
            message: 'Account get Done',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getAccountSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.account.findUnique({ where: { id } })
        res.status(201).send({
            success: true,
            message: 'Account get Done',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.account.delete({ where: { id } })
        res.status(201).send({
            success: true,
            message: 'Account delete Done',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const cashFlow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let totalAmount = 0;
        let result = await prisma.account.findMany({
            select: {
                accountName: true,
                accountNumber: true,
                accountType: true,
                bankName: true,
                currentBalance: true,
            }
        });
        for (let account of result) {
            totalAmount += account.currentBalance;
        }
        res.status(201).send({
            success: true,
            message: 'Cash Flow Data Done',
            data: {
                totalAmount: totalAmount.toFixed(2),
                accounts: result,
            }
        })
    }
    catch (err) {
        next(err)
    }
}