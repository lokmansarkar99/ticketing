import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {...data } = req.body;
       
        const result = await prisma.subCategory.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Sub Category Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getSubCategoryAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.SubCategoryWhereInput[] = [];

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
        const result = await prisma.subCategory.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.subCategory.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Sub Category retrieved Success',
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

export const getSubCategorySingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.subCategory.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Sub Category Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Sub Category retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findOrder = await prisma.subCategory.findUnique({
            where: {
                id
            },
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Sub Category Not Found'
            })
        }
       
        const result = await prisma.subCategory.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Sub Category Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Sub Category Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findOrder = await prisma.subCategory.findUnique({
            where: {
                id
            }
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Sub Category Not Found'
            })
        }


        const result = await prisma.subCategory.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Sub Category Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}