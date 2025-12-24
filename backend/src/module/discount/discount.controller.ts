import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export const createDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await prisma.discount.create({
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Discount Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getDiscountAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.DiscountWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { title: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.discount.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.discount.count({
            where: {
                AND: whereCondition
            }
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Discount retrieved Success',
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

export const getDiscountSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.discount.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Discount Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Discount retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const checkDiscountValidity = async (req: Request, res: Response, next: NextFunction) => {
    try {
       
        const title = req.query.title as string;
        const currentDate = new Date();

        const result = await prisma.discount.findFirst({
            where: {
                title: title,
                startDate: {
                    lte: currentDate,
                },
                endDate: {
                    gte: currentDate,
                },
            },
        });

        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Discount Not Found or Not Valid',
                data: false
            });
        }

        // If the discount is valid
        return res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Discount is valid',
            data: result
        });

    } catch (err) {
        next(err);
    }
};

export const deleteDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findDiscount = await prisma.discount.findUnique({
            where: {
                id
            },
        })
        if (!findDiscount) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Discount Not Found'
            })
        }
        const result = await prisma.discount.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Discount Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Discount Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findDiscount = await prisma.discount.findUnique({
            where: {
                id
            }
        })
        if (!findDiscount) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Discount Not Found'
            })
        }



        const result = await prisma.discount.update({
            where: {
                id,
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Discount Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}