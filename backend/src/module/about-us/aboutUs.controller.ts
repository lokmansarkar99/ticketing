import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createAboutUs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
       
        const result = await prisma.aboutUs.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'About Us Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getAboutUsAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortAboutUs, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.AboutUsWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { image: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.aboutUs.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.aboutUs.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'About Us retrieved Success',
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

export const getAboutUsSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.aboutUs.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'AboutUs Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single AboutUs retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const deleteAboutUs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findAboutUs = await prisma.aboutUs.findUnique({
            where: {
                id
            },
        })
        if (!findAboutUs) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'AboutUs Not Found'
            })
        }

        const result = await prisma.aboutUs.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'AboutUs Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: ' AboutUs Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateAboutUs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findAboutUs = await prisma.aboutUs.findUnique({
            where: {
                id
            }
        })
        if (!findAboutUs) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'About Us Not Found'
            })
        }


        const result = await prisma.aboutUs.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'About Us Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}