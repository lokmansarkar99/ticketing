import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";

export const createHelper = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { contactNo="null", } = req.body;
        const isExistingPhone = await prisma.helper.findUnique({ where: { contactNo } })
        if (isExistingPhone) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Helper Phone Already Exist"
            })
        }
        const result = await prisma.helper.create({
            data: req.body,
        })
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Helper Created Successfully',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getHelperAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = (parseInt(page as string) - 1) || 0;
        const take = (parseInt(size as string)) || 10;
        const order = (sortOrder as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
        const whereCondition: Prisma.HelperWhereInput[] = []
        if (skip < 0) {
            skip = 0
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { name: { contains: search as string, } },
                    { email: { contains: search as string, } },
                    { contactNo: { contains: search as string, } },
                    { address: { contains: search as string, } },
                ],
            });
        }
        [];
        let result = await prisma.helper.findMany({
            where: {
                AND: whereCondition,
            },
            select: {
                id:true,
                name: true,
                contactNo: true,
                address: true,
                active: true,
                avatar: true,
                referenceBy: true,
            },

            skip: skip * take,
            take,

        });

        let total = await prisma.helper.count();

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get Helper All Successfully',
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
export const getHelperSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await prisma.helper.findUnique({
            where: {
                id: Number(id)
            },
            
        })
        res.status(200).send({
            success: true,
            message: "Get Helper Success",
            statusCode: 200,
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteHelper = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await prisma.helper.delete({
            where: {
                id: Number(id)
            }
        })
        res.status(200).send({
            success: true,
            message: "Helper Delete Success",
            statusCode: 200,
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateHelper = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await prisma.helper.update({
            where: {
                id: Number(id)
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Helper Updated Success",
        })
    }
    catch (err) {
        next(err)
    }
}
