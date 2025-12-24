import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";

export const createInvestor = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { phone, } = req.body;
        const isExistingPhone = await prisma.investor.findUnique({ where: { phone } })
        if (isExistingPhone) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Investor Phone Already Exist"
            })
        }
        const result = await prisma.investor.create({
            data: req.body,
        })
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Investor Created Successfully',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getInvestorAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = (parseInt(page as string) - 1) || 0;
        const take = (parseInt(size as string)) || 10;
        const order = (sortOrder as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
        const whereCondition: Prisma.InvestorWhereInput[] = []
        if (skip < 0) {
            skip = 0
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { name: { contains: search as string, } },
                    { phone: { contains: search as string, } },
                    { address: { contains: search as string, } },
                ],
            });
        }
        [];
        let result = await prisma.investor.findMany({
            where: {
                AND: whereCondition
            },
            select: {
                id:true,
                name: true,
                phone: true,
                address: true,
            },

            skip: skip * take,
            take,

        });

        let total = await prisma.investor.count();

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get Investor All Successfully',
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

export const getInvestorSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await prisma.investor.findUnique({
            where: {
                id: Number(id)
            },

        })
        res.status(200).send({
            success: true,
            message: "Get Investor Success",
            statusCode: 200,
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteInvestor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await prisma.investor.delete({
            where: {
                id: Number(id)
            }
        })
        res.status(200).send({
            success: true,
            message: "Investor Delete Success",
            statusCode: 200,
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateInvestor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const findInvestor = await prisma.investor.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!findInvestor) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Investor Not Found'
            })
        }

        if (req.body.phone) {
            const findInvestorPhone = await prisma.investor.findUnique({
                where: {
                    phone: req.body.phone
                }
            })
            if (findInvestorPhone && findInvestor.id !== findInvestorPhone.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Phone Number Already Exists'
                })
            }
        }
        const result = await prisma.investor.update({
            where: {
                id: Number(id)
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Customer Updated Success",
        })
    }
    catch (err) {
        next(err)
    }
}